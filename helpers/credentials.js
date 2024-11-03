const credentials = {
  prod: {
      url: process.env.PROD_SEVEN_CONNECT_URL,
      username: process.env.PROD_SEVEN_CONNECT_USERNAME,
      password: process.env.PROD_SEVEN_CONNECT_PASS
  },
  test: {
    url: process.env.TEST_SEVEN_CONNECT_URL,
    username: process.env.TEST_SEVEN_CONNECT_USERNAME,
    password: process.env.TEST_SEVEN_CONNECT_PASS
  }
}

export default credentials