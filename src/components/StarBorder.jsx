import './StarBorder.css';

var StarBorder = function StarBorder(_ref) {
  var Component = _ref.as || 'button';
  var className = _ref.className || '';
  var color = _ref.color || 'white';
  var speed = _ref.speed || '6s';
  var rest = {};
  for (var key in _ref) { if (key !== 'as' && key !== 'className' && key !== 'color' && key !== 'speed' && key !== 'thickness' && key !== 'children') rest[key] = _ref[key]; }
  return <Component className={'star-border-container ' + className} {...rest}>
    <div className='border-gradient-bottom' style={{ background: 'radial-gradient(circle, ' + color + ', transparent 10%)', animationDuration: speed }}></div>
    <div className='border-gradient-top' style={{ background: 'radial-gradient(circle, ' + color + ', transparent 10%)', animationDuration: speed }}></div>
    <div className='inner-content'>{_ref.children}</div>
  </Component>;
};

export default StarBorder;