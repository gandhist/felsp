const { SET_STATUS_PESERTA } = require("redux/type")


const initialStatusPeserta = {
    is_cin : false,
    is_cout : false,
    time_cout : false,
    data_absen : {
        jam_cekin : null,
        foto_cekin : null,
        jam_cekout : null,
        foto_cekout : null,
        tanggal : null,
    },
    is_quiz_awal : false,
    param_quiz_awal : [],
    is_quiz_akhir : false,
    param_quiz_akhir : [],
    is_kuisioner : false,
}


const StatusPesertaReducer = (state = initialStatusPeserta, action) => {
    if(action.type === SET_STATUS_PESERTA){
        return {...state, ...action.data}
    }
    return state;
}

export {StatusPesertaReducer}