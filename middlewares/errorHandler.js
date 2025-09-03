const errorHandler = (err, req, res) => {
    if (err.code === 11000) {
        return res.send("Duplicate error")
    } else {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
            code: err.code,
            stack: err.stack,
            text: err.message
        })
    }
}

export default errorHandler