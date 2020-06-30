export default (error, req, res, next) => {
  res.status(500).json({
    message: 'Sorry something go wrong',
    error
  });
};
