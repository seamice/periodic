console.clear();

const DELAY = 5,
STP = 273,
ELEMENT_MODAL_DATA = {
    "Hydrogen": { 
        "name": "Element: Hydrogen", 
        "symbol": "Symbol: H", 
        "atomic-number": "Atomic number: 1", 
        "atomic-weight": "Atomic weight: 1.008 (conventional)", 
        "group": " Group: 1", 
        "period": "Period: 1", 
        "category": "Category: Reactive non-metal", 
        "block": "Block: s-block", 
        "electron-configuration": "Electron configuration: 1s<sup>1</sup>", 
        "electron-per-shell": "Electrons per shell: 1", 
        "phase-at-STP": "Phase at STP: Gas", 
        "melting-point": "Melting point: 13.99 K", 
        "boiling-point": "Boiling point: 20.271 K", 
        "oxidation-states": "Oxidation states: -1, +1 (an amphoteric oxide)", 
        "electronegativity": "Pauling scale: 2.20", 
        "ionization-energy": "Ionization energy: 1st: 1312.0 kJ/mol", 
        "covalent-radius": "Covalent radius: 31±5 pm", 
        "van-der-waals-radius": "Van der Waals radius: 120 pm", 
        "crystal-structure": "Crystal structure: hexagonal", 
        "thermal-conductivity": "Thermal conductivity: 0.1805 W/(m·K)", 
        "magnetic-order": "Magnetic order: diamagnetic", 
        "magnetic-susceptibility": "Magnetic susceptibility: −3.98·10−6 cm<sup>3</sup>/mol ", 
        "miscellaneous": "Discovered in 1766 by Henry Cavendish (named by Antoine Lavoisier in 1783)" 
    },
    "Litium": {} 
};


let periodList  = document.querySelectorAll('.period__item'),
    groupList   = document.querySelectorAll('.group__item'),
    elementList = document.querySelectorAll('.element'),
    legendList  = document.querySelectorAll('.legend-box'),
    temperatureSlider      = document.querySelector('.temperature__inputs__slider'),
    resetTemperatureButton = document.querySelector('.reset__temperature'),
    lanthanoidBox   = document.querySelector(`[data-element-name='Lanthanoids']`),
    actinoidBox     = document.querySelector(`[data-element-name='Actinoids']`),
    modalBox        = document.querySelector('.modal'),
    modalContent    = document.querySelector('.modal__content'),
    modalProperties = document.querySelector('.modal__content__properties'),
    modalClose      = document.querySelector('.modal__close'),
    isOpen = false,
    elementClicked;

window.addEventListener('scroll', () => {
  let scrollY = window.scrollY > 0 ? true : false,
  scrollX = window.scrollX > 0 ? true : false,
  period = document.querySelector('.period__list'),
  group = document.querySelector('.group__list');

  if (scrollX) {
    addClass('--is-fixed', period, 0);
    period.style.left = `${window.scrollX}px`;
  } else {
    removeClass('--is-fixed', period, 0);
    period.style.left = 0;
  }
  if (scrollY) {
    addClass('--is-fixed', group, 0);
  } else {
    removeClass('--is-fixed', group, 0);
  }
});


modalClose.addEventListener('click', closeModal);
modalBox.addEventListener('click', closeModal);
document.addEventListener('keydown', event => {
  if (event.keyCode === 27 && isOpen) {
    closeModal(event);
  }
});

actinoidBox.addEventListener('mouseenter', self => {
  let dataActinoids = self.target.getAttribute('data-element-type'),
  dataToSearch = 'type';

  highlightElement(dataActinoids, dataToSearch);
});

actinoidBox.addEventListener('mouseleave', () => {
  equalizeElement();
});

lanthanoidBox.addEventListener('mouseenter', self => {
  let dataLantanoids = self.target.getAttribute('data-element-type'),
  dataToSearch = 'type';

  highlightElement(dataLantanoids, dataToSearch);
});

lanthanoidBox.addEventListener('mouseleave', () => {
  equalizeElement();
});

resetTemperatureButton.addEventListener('click', () => {
  let dataToSearch = ['melting-point', 'boiling-point'];

  temperatureSlider.value = STP;

  setNewTemperature(STP);
  highlightElement(STP, dataToSearch);
  removeClass('--is-visible', resetTemperatureButton, 0);
});

temperatureSlider.addEventListener('input', self => {
  let currentValue = Number(self.target.value),
  dataToSearch = ['melting-point', 'boiling-point'];

  if (currentValue !== STP && !resetTemperatureButton.classList.contains('--is-visible')) {
    addClass('--is-visible', resetTemperatureButton, 0);
  } else if (currentValue === STP) {
    removeClass('--is-visible', resetTemperatureButton, 0);
  }

  setNewTemperature(currentValue);
  highlightElement(currentValue, dataToSearch);
});

Array.from(elementList).forEach(elementItem => {
  elementItem.addEventListener('click', () => {
    if (isLanthanoidOrActinoid(elementItem)) {
      elementClicked = elementItem;
      elementName = elementClicked.getAttribute('data-element-name');

      modalAnimation(elementItem);
      createModalContent(elementName);
    }
  });
});

Array.from(legendList).forEach(legendItem => {
  legendItem.addEventListener('mouseenter', self => {
    let legendData,
    dataToSearch;

    if (legendItem.getAttribute('data-element-type')) {
      legendData = self.target.getAttribute('data-element-type');
      dataToSearch = 'type';
    } else {
      legendData = self.target.getAttribute('data-element-state');
      dataToSearch = 'state';
    }

    highlightElement(legendData, dataToSearch);
  });

  legendItem.addEventListener('mouseleave', () => {
    equalizeElement();
  });
});

Array.from(periodList).forEach(periodItem => {
  periodItem.addEventListener('mouseenter', self => {
    let periodNumber = Number(self.target.firstChild.innerHTML),
    dataToSearch = 'period';

    highlightElement(periodNumber, dataToSearch);
  });

  periodItem.addEventListener('mouseleave', () => {
    equalizeElement();
  });
});

Array.from(groupList).forEach(groupItem => {
  groupItem.addEventListener('mouseenter', self => {
    let groupNumber = Number(self.target.firstChild.innerHTML),
    dataToSearch = 'group';

    highlightElement(groupNumber, dataToSearch);
  });

  groupItem.addEventListener('mouseleave', () => {
    equalizeElement();
  });
});

function equalizeElement() {
  let index = 0;

  Array.from(elementList).forEach(elementItem => {
    removeClass('--is-active', elementItem, index);
    index++;
  });
};

function highlightElement(dataElement, dataToSearch) {
  let index = 0;

  Array.from(elementList).forEach(elementItem => {
    let dataFromElement = elementItem.getAttribute(`data-element-${dataToSearch}`);

    if (dataToSearch === 'group' || dataToSearch === 'period') {
      dataFromElement = Number(dataFromElement);
    }

    if (dataToSearch.length === 2) {
      let meltingPoint = Number(elementItem.getAttribute(`data-element-${dataToSearch[0]}`)),
      boilingPoint = Number(elementItem.getAttribute(`data-element-${dataToSearch[1]}`));

      if (!isNaN(meltingPoint) && !isNaN(boilingPoint)) {
        if (dataElement < meltingPoint) {
          elementItem.setAttribute('data-element-state', 'solid');
        } else
        if (dataElement < boilingPoint) {
          if (isLanthanoidOrActinoid(elementItem)) {
            elementItem.setAttribute('data-element-state', 'liquid');
          }
        } else {
          elementItem.setAttribute('data-element-state', 'gas');
        }
      } else if (isNaN(boilingPoint)) {
        let elementState = 'unknown';
        if (dataElement < meltingPoint) {
          elementState = 'solid';
        }
        elementItem.setAttribute('data-element-state', elementState);
      }
    }

    if (dataElement === dataFromElement) {
      addClass('--is-active', elementItem, index);
    }

    index++;
  });
};

function createModalContent(elementName) {
  Object.keys(ELEMENT_MODAL_DATA[elementName]).forEach(key => modalProperties.innerHTML += `<p class='element-property element-${key}'>${ELEMENT_MODAL_DATA[elementName][key]}</p>`);
}

function removeModalContent() {
  modalProperties.innerHTML = '';
}

function modalAnimation(self) {
  let selfProperties = self.getBoundingClientRect(),
  modalProperties = modalContent.getBoundingClientRect(),
  tooltip = self.querySelector('.tooltip'),
  translateX,
  translateY,
  scale,
  positionX = window.innerWidth / 2,
  positionY = window.innerHeight / 2;

  addClass('--is-hidden', tooltip, 0);
  addClass('--is-triggered', self, 0);
  addClass('modal__background', modalBox, 0);

  scale = modalProperties.width / 100;
  translateX = Math.round(positionX - selfProperties.left - selfProperties.width / 2);
  translateY = Math.round(positionY - selfProperties.top - selfProperties.height / 2);
  self.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;

  window.requestAnimationFrame(() => {
    openModal();
  });
}

function openModal() {
  if (!isOpen) {
    let content = modalBox.querySelector('.modal__content');

    addClass('--is-visible', modalBox, 0);
    addClass('--is-visible', content, 75);

    content.addEventListener('transitionend', hideContent(content), false);

    isOpen = true;
  }
}

function hideContent(content) {
  content.removeEventListener('transitionend', hideContent, false);
}

function closeModal(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  let target = event.target,
  tooltip = elementClicked.querySelector('.tooltip');

  if (isOpen && target.classList.contains('modal__background') || target.classList.contains('modal__close') || event.keyCode === 27) {
    removeClass('--is-visible', modalBox, 0);
    removeClass('--is-visible', modalContent, 0);

    elementClicked.removeAttribute('style');

    removeClass('--is-triggered', elementClicked, 0);
    removeClass('modal__background', modalBox, 0);
    removeClass('--is-hidden', tooltip, 0);

    removeModalContent();

    elementClicked = '';
    isOpen = false;
  }
}

function setNewTemperature(currentValue) {
  let kelvinOutput = document.querySelector('.temperature__inputs__result'),
  celsiusOutput = document.querySelector('.celsius'),
  farenheitOutput = document.querySelector('.farenheit');

  kelvinOutput.innerHTML = `${currentValue} K`;
  celsiusOutput.innerHTML = `${currentValue - 273}ºC`;
  farenheitOutput.innerHTML = `${Math.round((currentValue * 9 / 5 - 460) * 100) / 100}ºF`;
}

function addClass(className, element, index) {
  setTimeout(() => {
    element.classList.add(className);
  }, index * DELAY);
}

function removeClass(className, element, index) {
  setTimeout(() => {
    element.classList.remove(className);
  }, index * DELAY);
}

function isLanthanoidOrActinoid(elementItem) {
  if (elementItem.getAttribute('data-element-name') !== 'Lanthanoids' && elementItem.getAttribute('data-element-name') !== 'Actinoids') {
    return true;
  } else {
    return false;
  }
}