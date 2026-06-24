import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportPDF(element) {
  if (!element) return;

  // 保存原始 CSS transform（预览为了适配屏幕做了 scale(0.7)）
  const origTransform = element.style.transform;
  const origTransformOrigin = element.style.transformOrigin;

  // 临时移除 scale，让 html2canvas 捕获原生分辨率
  element.style.transform = 'none';
  element.style.transformOrigin = 'unset';

  // 等待浏览器重排完成
  await new Promise(resolve => requestAnimationFrame(resolve));

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // PNG 无损格式，适合文字为主的简历
    const imgData = canvas.toDataURL('image/png');

    // A4 尺寸 210mm x 297mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = 297;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    // 导出为 Blob，让用户选择保存位置
    const pdfBlob = pdf.output('blob');
    const fileName = '我的简历.pdf';

    // 优先使用 File System Access API（Chrome/Edge 支持选择保存路径）
    try {
      if (typeof window.showSaveFilePicker === 'function') {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'PDF 文件',
            accept: { 'application/pdf': ['.pdf'] }
          }]
        });
        const writable = await handle.createWritable();
        await writable.write(pdfBlob);
        await writable.close();
    showToast('PDF 已保存');
      } else {
        // 传统下载方式（保存到默认下载目录）
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    showToast('PDF 开始下载');
      }
    } catch (pickerErr) {
      // 用户取消选择时的兜底方案
      if (pickerErr.name !== 'AbortError') {
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    showToast('PDF 开始下载');
      }
    }
  } catch (err) {
    console.error('PDF导出失败:', err);
    showToast('PDF 导出失败');
    throw err;
  } finally {
    // 恢复预览的 scale 样式
    element.style.transform = origTransform;
    element.style.transformOrigin = origTransformOrigin;
  }
}

function showToast(msg) {
  try {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#667eea;color:#fff;padding:12px 28px;border-radius:10px;font-size:15px;z-index:99999;font-family:sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:opacity 0.3s;';
    document.body.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; setTimeout(function() { try { document.body.removeChild(t); } catch(e) {} }, 400); }, 2500);
  } catch(e) {}
}