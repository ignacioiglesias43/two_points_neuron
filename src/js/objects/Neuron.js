class Neuron {
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

  /**
   * Clasifica el arreglo de entradas
   * @param {number[]} x
   */
  classify(x) {
    // Cálculo con la capa oculta
    this.hiddenOutput = this.calculateOutputs(
      x,
      this.layers.entry,
      this.layers.hidden,
      this.hiddenWeights,
      this.hiddenBias
    );
    // Cálculo con la capa de salida
    this.exitOutput = this.calculateOutputs(
      this.hiddenOutput,
      this.layers.hidden,
      this.layers.exit,
      this.exitWeights,
      this.exitBias
    );

    this.exitOutput = this.exitOutput.map((value) => Math.round(value));

    return this.exitOutput;
  }

  /**
   * Sigmoid Function
   * @param {number} sum
   */
  f = (sum) => 1 / (1 + Math.exp(-sum));

  /**
   * Sigmoid derivative
   * @param {number} x
   */
  dF = (x) => this.f(x) * (1 - this.f(x));

  calculateOutputs(array, weight, height, weights, bias) {
    const outputs = [];
    let result;

    Array.from(new Array(height)).forEach((_, i) => {
      result = bias[i];
      Array.from(new Array(weight)).forEach(
        (_, j) => (result += array[j] * weights[j][i])
      );
      outputs.push(this.f(result));
    });

    return outputs;
  }

  /**
   * Funcion de entrenamiento
   * @param {[]} x
   * @param {[]} values
   */
  train(x, values) {
    const hiddenD = Array(this.layers.hidden);
    const exitD = Array(this.layers.exit);

    // console.log(exitD);

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

    // Actualizacion de pesos en base a los recientes cambios
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

  /**
   * Funcion para actualizar los pesos
   * @param {number[]} weights
   * @param {number[]} arrayChange
   * @param {number[]} arrayInput
   * @returns number[][]
   */
  calculateWeights = (weights, arrayChange, arrayInput) =>
    arrayInput.map((_, i) =>
      arrayChange.map(
        (_, j) => weights[i][j] + arrayInput[i] * arrayChange[j] * this.alpha
      )
    );
}
