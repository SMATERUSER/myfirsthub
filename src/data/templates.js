var nid = { v: 1 };
function id() { return 'i' + (nid.v++); }

export var templates = [{
  id: 't1', name: '\u7B80\u7EA6\u9ED1\u767D', themeColor: '#1a1a2e',
  description: '\u7ECF\u5178\u9ED1\u767D\u914D\u8272\uFF0C\u7B80\u6D01\u5E72\u7EC3\uFF0C\u9002\u5408\u5404\u884C\u4E1A\u6C42\u804C\u8005',
  data: {
    personalInfo: {
      name: '\u8D75\u6BC5', phone: '136-0008-1111', email: 'zhaoyi@email.com',
      address: '\u5317\u4EAC\u5E02\u6D77\u6DC0\u533A', title: '\u8425\u517B\u5E08',
      birthDate: '1994-05', school: '\u4E2D\u56FD\u519C\u4E1A\u5927\u5B66', major: '\u98DF\u54C1\u79D1\u5B66\u4E0E\u8425\u517B\u5B66',
      summary: '5\u5E74\u8425\u517B\u5065\u5EB7\u7BA1\u7406\u7ECF\u9A8C\uFF0C\u64C5\u957F\u4E2A\u4F53\u5316\u8425\u517B\u65B9\u6848\u8BBE\u8BA1\u4E0E\u5065\u5EB7\u7BA1\u7406\u3002\u6301\u6709\u56FD\u5BB6\u8425\u517B\u5E08\u8D44\u683C\u8BC1\u4E66\uFF0C\u7CBE\u901A\u98DF\u7269\u8425\u517B\u5206\u6790\u4E0E\u996E\u98DF\u8C03\u7406\u3002',
      avatar: null
    },
    education: [
      { id: id(), school: '\u4E2D\u56FD\u519C\u4E1A\u5927\u5B66', degree: '\u7855\u58EB', major: '\u98DF\u54C1\u79D1\u5B66\u4E0E\u8425\u517B\u5B66', startDate: '2016-09', endDate: '2019-06', description: '\u7814\u7A76\u65B9\u5411\uFF1A\u4E34\u5E8A\u8425\u517B\u652F\u6301' },
      { id: id(), school: '\u5317\u4EAC\u8054\u5408\u5927\u5B66', degree: '\u5B66\u58EB', major: '\u8425\u517B\u4E0E\u98DF\u54C1\u536B\u751F', startDate: '2012-09', endDate: '2016-06', description: '\u6821\u7EA7\u4F18\u79C0\u6BD5\u4E1A\u751F' }
    ],
    experience: [
      { id: id(), company: '\u5317\u4EAC\u534F\u548C\u533B\u9662', position: '\u4E34\u5E8A\u8425\u517B\u5E08', startDate: '2020-03', endDate: '', description: '\u8D1F\u8D23\u60A3\u8005\u8425\u517B\u8BC4\u4F30\u4E0E\u996E\u98DF\u6CBB\u7597', bulletPoints: ['\u5B9A\u671F\u4E3A300+\u60A3\u8005\u5236\u5B9A\u4E2A\u4F53\u5316\u8425\u517B\u65B9\u6848', '\u4E3B\u6301\u8425\u517B\u5EB7\u590D\u8BFE\u5802\uFF0C\u53D7\u8BB2\u8005\u8D85\u8FC72000\u4EBA\u6B21', '\u53C2\u4E0E\u4E34\u5E8A\u8425\u517B\u652F\u6301\u7814\u7A76\u9879\u76EE'] },
      { id: id(), company: '\u767E\u5EB7\u5065\u5EB7\u7BA1\u7406\u4E2D\u5FC3', position: '\u8425\u517B\u987E\u95EE', startDate: '2017-09', endDate: '2020-02', description: '\u8D1F\u8D23\u5BA2\u6237\u8425\u517B\u5065\u5EB7\u7BA1\u7406\u54A8\u8BE2', bulletPoints: ['\u7D2F\u8BA1\u670D\u52A1\u8425\u517B\u54A8\u8BE2\u5BA2\u62371000+\u540D', '\u8BBE\u8BA1\u5E76\u63A8\u5E7F\u5065\u5EB7\u996E\u98DF\u8BFE\u7A0B'] }
    ],
    skills: [
      { id: id(), name: '\u4E34\u5E8A\u8425\u517B', level: '\u7CBE\u901A' },
      { id: id(), name: '\u996E\u98DF\u8C03\u7406', level: '\u7CBE\u901A' },
      { id: id(), name: '\u8425\u517B\u5206\u6790', level: '\u7CBE\u901A' },
      { id: id(), name: '\u5065\u5EB7\u6559\u80B2', level: '\u9AD8\u7EA7' }
    ],
    certificates: [
      { id: id(), name: '\u56FD\u5BB6\u8425\u517B\u5E08\u8D44\u683C\u8BC1\u4E66', date: '2018-06' },
      { id: id(), name: '\u5065\u5EB7\u7BA1\u7406\u5E08\u8BC1\u4E66', date: '2020-09' }
    ],
    projects: [
      { id: id(), name: '\u60A3\u8005\u8425\u517B\u652F\u6301\u4F53\u7CFB\u5EFA\u8BBE', role: '\u9879\u76EE\u8D1F\u8D23\u4EBA', description: '\u5EFA\u7ACB\u60A3\u8005\u8425\u517B\u8BC4\u4F30\u4E0E\u8DDF\u8E2A\u4F53\u7CFB\u3002', technologies: ['\u8425\u517B\u8F6F\u4EF6', 'SPSS', 'Excel'], startDate: '2021-01', endDate: '2021-12', url: '' },
      { id: id(), name: '\u5065\u5EB7\u996E\u98DF\u79D1\u666E\u9879\u76EE', role: '\u5185\u5BB9\u4E3B\u64AD', description: '\u8BBE\u8BA1\u5E76\u5236\u4F5C\u5065\u5EB7\u996E\u98DF\u79D1\u666E\u89C6\u9891\u3002', technologies: ['\u77ED\u89C6\u9891', '\u793E\u4EA4\u5A92\u4F53'], startDate: '2022-03', endDate: '', url: '' }
    ]
  }
}];