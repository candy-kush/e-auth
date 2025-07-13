const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitizeInput(input) {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input);
  } else if (typeof input === 'object' && input !== null) {
    for (const key in input) {
      input[key] = sanitizeInput(input[key]);
    }
  }
  return input;
}

const requestSanitizer = (req, res, next) => {
  try {
    console.log("sanitizing request");
    req.body = sanitizeInput(req.body);
    req.query = sanitizeInput(req.query);
    req.params = sanitizeInput(req.params);
    next();
  } catch (error) {
    console.log("error occured in requestSanitizer: ", error);
  }
};

module.exports = {
  requestSanitizer
};