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
    Array.from(new Array(layers.hidden)).forEach(() => {
      this.hiddenWeights.push(getRandom(1, 0));
      this.hiddenBias.push(getRandom(1, 0));
    });

    Array.from(new Array(layers.exit)).forEach(() => {
      this.exitWeights.push(getRandom(1, 0));
      this.exitBias.push(getRandom(1, 0));
    });

    this.hiddenOutput = [];
    this.exitOutput = [];
  }

  /**
   * Clasifica el arreglo de entradas
   * @param {number[]} x
   */
  classify(x) {
    let result;

    // Cálculo con la capa oculta
    Array.from(new Array(this.layers.hidden)).forEach((_, hiddenIndex) => {
      result = this.hiddenBias[hiddenIndex];
      Array.from(new Array(this.layers.entry)).forEach((_, entryIndex) => {
        result += x[entryIndex] * this.hiddenWeights[entryIndex][hiddenIndex];
      });
      this.hiddenOutput[hiddenIndex] = this.f(result);
    });

    // Cálculo con la capa de salida
    Array.from(new Array(this.layers.exit)).forEach((_, exitIndex) => {
      result = this.exitBias[exitIndex];
      Array.from(new Array(this.layers.hidden)).forEach((_, hiddenIndex) => {
        result +=
          this.hiddenOutput[hiddenIndex] *
          this.exitWeights[hiddenIndex][exitIndex];
      });
      this.exitOutput[exitIndex] = this.f(result);
    });

    this.exitOutput = this.exitOutput.map((value) => Math.round(value));
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

  /**
   * Funcion de entrenamiento
   * @param {[]} x
   * @param {[]} values
   */
  train(x, values) {
    const hiddenD = Array(this.layers.exit);
    const exitD = Array(this.layers.hidden);

    this.classify(x);
    // Cálculo con capa oculta
    Array.from(new Array(this.layers.exit)).forEach((_, exitIndex) => {
      const error =
        values[exitIndex] - Math.round(this.hiddenOutput[exitIndex]);
      hiddenD[exitIndex] = error * this.dF(this.hiddenOutput[exitIndex]);
    });

    // Cálculo con capa de salida
    Array.from(new Array(this.layers.hidden)).forEach((_, hiddenIndex) => {
      let error = 0;
      Array.from(new Array(this.layers.exit)).forEach((_, exitIndex) => {
        error += this.exitWeights[hiddenIndex][exitIndex] * hiddenD[exitIndex];
        exitD[hiddenIndex] = error * this.dF(this.exitOutput[hiddenIndex]);
      });
    });

    // Actualizacion de pesos en base a los recientes cambios
    this.exitBias = this.exitBias.map(
      (val, i) => val + this.alpha * hiddenD[i]
    );

    this.hiddenBias = this.hiddenBias.map(
      (val, i) => val + this.alpha * exitD[i]
    );
    this.exitWeights = this.calculateWeights(
      this.exitWeights,
      hiddenD,
      this.exitOutput
    );
    this.hiddenWeights = this.calculateWeights(
      this.hiddenWeights,
      exitD,
      this.hiddenOutput
    );
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
