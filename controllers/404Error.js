export default (req, res, next) => {
  res.status(404).send('404, No Url is defined');
};
