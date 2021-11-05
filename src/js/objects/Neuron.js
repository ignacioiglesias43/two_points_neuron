class Neuron {
  constructor(nInputs, alpha) {
    this.weights = [];

    Array.from(new Array(nInputs)).forEach(() =>
      this.weights.push(Math.random() * 3)
    );

    this.bias = BIAS;

    this.alpha = alpha;
  }

  /**
   * Funcion para clasificar en base a las coordenadas del punto y de los pesos
   * @param {object} coords
   * @param {number} coords.x
   * @param {number} coords.y
   * @returns number
   */
  classify(coords) {
    const sum =
      this.weights.reduce(
        (previousValue, currentValue) =>
          coords.x * previousValue + coords.y * currentValue
      ) + this.bias;

    return this.f(sum);
  }

  /**
   * Sigmoid Function
   * @param {number} sum
   */
  f = (sum) => 1 / (1 + Math.exp(-sum));

  /**
   * Para cada punto (x,y) se tiene el resultado correcto los pesos se actualizan considerando el error de la clasificación
   * @param {object} coords
   * @param {number} coords.x
   * @param {number} coords.y
   * @param {number} type
   */
  training(coords, type) {
    const value = this.classify(coords);
    const error = type - value;

    this.weights.forEach(
      (weight, index) =>
        (weight += (index % 2 === 0 ? coords.x : coords.y) * error * this.alpha)
    );

    this.bias += error * value;
  }
}
