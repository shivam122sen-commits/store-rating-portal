const validateSignupOrUser = (req, res, next) => {
  const { name, email, password, address } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.length < 3 || name.length > 60) {
      return res.status(400).json({ error: 'Name must be between 3 and 60 characters.' });
    }
  }

  if (address !== undefined) {
    if (typeof address !== 'string' || address.length > 400) {
      return res.status(400).json({ error: 'Address must not exceed 400 characters.' });
    }
  }

  if (email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }
  }

  if (password !== undefined) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be 8-16 characters and contain at least one uppercase letter and one special character.' 
      });
    }
  }

  next();
};

module.exports = { validateSignupOrUser };