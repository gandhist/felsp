const { SET_STATUS_PESERTA } = require("redux/type")

const setStatusPeserta = (data) => {
    return {type: SET_STATUS_PESERTA, data}
}

export {setStatusPeserta}