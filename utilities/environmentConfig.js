const ENVIRONMENTS = {
  clms55: 'http://192.168.40.115/CLMS_ENT_5.5/app',
  clms56: 'http://localhost/CLMS_5_6/app'
};

function resolveAppUrl() {
  const selectedEnvironment = (process.env.CLMS_ENV || '').toLowerCase();

  if (selectedEnvironment && ENVIRONMENTS[selectedEnvironment]) {
    return ENVIRONMENTS[selectedEnvironment];
  }

  if (selectedEnvironment) {
    throw new Error(`Unknown CLMS_ENV "${process.env.CLMS_ENV}". Use clms55 or clms56.`);
  }

  return process.env.BASE_URL || ENVIRONMENTS.clms55;
}

module.exports = { ENVIRONMENTS, resolveAppUrl };
