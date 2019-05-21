import _ from "lodash";
import './style.css';
import MyImage from './my-image.jpg';
import Data from './data.xml';

function component() {
  const element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');
  const myIcon = new Image();
  myIcon.src = MyImage;

  element.appendChild(myIcon);
  console.log(Data);

  return element;
}

document.body.appendChild(component());