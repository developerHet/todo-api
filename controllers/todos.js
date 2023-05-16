const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

const Todo = require("../models/Todo");

exports.getTodos = asyncHandler(async (req, res, next) => {
  const todos = await Todo.find({ user: req.user.id });
  res.status(200).json({ todos });
});

exports.createTodo = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const todo = await Todo.create(req.body);
  res.status(201).json({ todo });
});

exports.updateTodo = asyncHandler(async (req, res, next) => {
  let todo = await Todo.findById(req.params.id);

  if (!todo) {
    return next(new ErrorResponse(`Todo not found`, 404));
  }

  // Make sure user is todo owner
  if (todo.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User is not authorized`, 401));
  }

  todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ todo });
});

exports.deleteTodo = asyncHandler(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    return next(new ErrorResponse(`Todo not found`, 404));
  }

  // Make sure user is todo owner
  if (todo.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User is not authorized`, 401));
  }
  await Todo.findByIdAndDelete(req.params.id);
  res.status(200).json();
});
