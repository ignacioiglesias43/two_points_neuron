const getRandom = (max = 1, min = 0) => Math.random() * (max - min) + min;

const getPointType = (vals) => {
  if (vals[0] == 1 && vals[1] == 0 && vals[2] == 0) {
    return 1;
  } else if (vals[0] == 0 && vals[1] == 1 && vals[2] == 0) {
    return 2;
  } else if (vals[0] == 0 && vals[1] == 0 && vals[2] == 1) {
    return 3;
  } else return 0;
};
