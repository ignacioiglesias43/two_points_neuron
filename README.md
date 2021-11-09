# Clasificador de puntos con dos neuronas en la capa de salida

Hacer un programa que determine clasifique puntos. Los puntos se agrupan en torno a dos centros fijos en el plano, (1,3) y (3,1).

## Funcionamiento

## Neuron.js

La neurona recibe como parametros las capas (entrada, salida, oculta) y la tasa de aprendizaje. Aquí se inicializan los valores de los pesos y el bias en base a las capas.

```js
/**
   * @constructor
   * @param {object} layers
   * @param {number} layers.entry
   * @param {number} layers.hidden
   * @param {number} layers.exit
   * @param {number} learningRate
   */
  constructor(layers, learningRate) {
    this.layers = layers;
    this.alpha = learningRate;
    /*  Pesos y Bias */
    this.hiddenWeights = [];
    this.hiddenBias = [];
    this.exitWeights = [];
    this.exitBias = [];

    /* Llenado de pesos y bias */
    Array.from(new Array(layers.hidden)).forEach(() =>
      this.hiddenBias.push(getRandom(1, 0))
    );

    Array.from(new Array(layers.exit)).forEach(() =>
      this.exitBias.push(getRandom(1, 0))
    );

    this.hiddenWeights = Array.from(new Array(layers.entry)).map(() =>
      Array.from(new Array(layers.hidden)).map(() => getRandom(1, 0))
    );

    this.exitWeights = Array.from(new Array(layers.hidden)).map(() =>
      Array.from(new Array(layers.exit)).map(() => getRandom(1, 0))
    );

    this.hiddenOutput = Array(layers.hidden);
    this.exitOutput = Array(layers.exit);
  }
```

La función de entrenamiento recibe las posiciones dentro del plano y el rango en el que están, para así clasificarlas calculando los arreglos de cambios necesarios, con el producto de la resta del valor real y el conseguido por la derivada de la sigmoide de la salida.

```js
/**
   * Funcion de entrenamiento
   * @param {[]} x
   * @param {[]} values
   */
  train(x, values) {
    const hiddenD = Array(this.layers.hidden);
    const exitD = Array(this.layers.exit);

    // Aquí se clasifican los datos de cada capa y se redondea el arreglo resultante
    this.classify(x);
    // Cálculo con capa de salida
    Array.from(new Array(this.layers.exit)).forEach((_, exitIndex) => {
      const error = values[exitIndex] - Math.round(this.exitOutput[exitIndex]);
      exitD[exitIndex] = error * this.dF(this.exitOutput[exitIndex]);
    });

    // Cálculo con capa oculta
    Array.from(new Array(this.layers.hidden)).forEach((_, hiddenIndex) => {
      let error = 0;
      Array.from(new Array(this.layers.exit)).forEach((_, exitIndex) => {
        error += this.exitWeights[hiddenIndex][exitIndex] * exitD[exitIndex];
      });
      hiddenD[hiddenIndex] = error * this.dF(this.hiddenOutput[hiddenIndex]);
    });

    // Actualizacion de pesos y bias en base a los recientes cambios

    this.exitBias = this.exitBias.map((val, i) => val + this.alpha * exitD[i]);
    this.hiddenBias = this.hiddenBias.map(
      (val, i) => val + this.alpha * hiddenD[i]
    );

    this.exitWeights = this.calculateWeights(
      this.exitWeights,
      exitD,
      this.hiddenOutput
    );

    this.hiddenWeights = this.calculateWeights(this.hiddenWeights, hiddenD, x);
  }
```

## Point.js

Clase utilizada para pintar los puntos dentro del plano. Los puntos de tipo 1 se pintan de rojo, de tipo 2 de verde, y los demás de un gris oscuro.

```js
class Point {
  constructor(x, y, type = 1) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw() {
    push();
    strokeWeight(5);
    if (this.type === 1) stroke(255, 0, 0);
    else if (this.type === 2) stroke(0, 255, 0);
    else stroke(80);

    point(this.x, this.y);
    pop();
  }
}
```

## Sketch.js

Aquí se pintan los objetos dentro del plano. Se utiliza un arreglo de puntos, se llenan de forma aleatoria en base a las posiciones de los circulos, categorizando cada punto para así entrenar la neurona y obtener el tipo de cada punto.

```js
points.forEach((point) => {
  const values = categorize([0, 0, 0], point);

  perceptron.train([point.x, point.y], values);
  point.type = getPointType(perceptron.classify([point.x, point.y]));
  point.draw();
});

const getPointType = (vals) => {
  if (vals[0] == 1 && vals[1] == 0 && vals[2] == 0) {
    return 1;
  } else if (vals[0] == 0 && vals[1] == 1 && vals[2] == 0) {
    return 2;
  } else {
    return 0;
  }
};

function categorize(values = [], point) {
  const vals = values;

  if (isInRange(point, type1)) {
    vals[0] = 1;
  } else if (isInRange(point, type2)) {
    vals[1] = 1;
  }

  return vals;
}

const isInRange = (point, target) =>
  dist(point.x, point.y, target.x, target.x) < RANGE;
```

## Salida

URL: https://ignacioiglesias43.github.io/two_points_neuron/

Ejemplo:

![Gif del funcionamiento](/ejemplo.gif)
