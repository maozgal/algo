var Queue = function() {
  this.queue = [];
};

Queue.prototype.enqueue = function(data) {
  this.queue.push(data);
};

Queue.prototype.dequeue = function() {
  var item = this.queue.shift();
  return item;
};

Queue.prototype.isEmpty = function() {
  return this.queue.length === 0;
};
