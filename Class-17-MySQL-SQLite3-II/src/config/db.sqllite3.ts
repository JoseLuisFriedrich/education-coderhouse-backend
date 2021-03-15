const sqLite3Config = () => {
  return {
    client: 'sqlite3',
    connection: {
      filename: './../jlf_coder_backend.sqlite',
    },
    useNullAsDefault: false,
  }
}

export default sqLite3Config
