exports.params_get_by_id = (req, res, next) => {
  const { id } = req.params;
  // const id_number = Number(id);
  // const is_number = !isNaN(id_number);
  // if (!is_number) {
  //   next("'id' is not a number");
  // } else {
  //   req.params.id = id_number;
  //   next();
  // }
  next();
};

exports.body_update_message_validation = (req, res, next) => {
  // TODO:
  next();
};
