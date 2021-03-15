const mySqlConfig = (setDb = true) => {
  return {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: 'coder123',
      database: setDb ? 'jlf_coder_backend' : null,
    },
  }
}

export default mySqlConfig
