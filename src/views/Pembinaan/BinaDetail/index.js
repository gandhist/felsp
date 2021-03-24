import { BASE_URL, ATT_IMG } from 'api';
import React, { useRef, useEffect, useState } from 'react'
import {
    Button,
    Card,
    Container,
    Row,
    Col,
    Alert
} from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import Webcam from "react-webcam";
import { setStatusPeserta } from '../../../redux/action';
import NotificationAlert from "react-notification-alert";
import { epochPrettyDate } from 'utils/Format';


const BinaDetail = () => {
    const dispatch = useDispatch();
    const stateStatusPeserta = useSelector(state => state.StatusPesertaReducer)
    const webcamRef = useRef(null)
    const notificationAlertRef = useRef(null);
    const { id_jadwal } = useParams();
    const localAuth = JSON.parse(localStorage.getItem('p3sAuth'));
    const [dataKegiatan, setdataKegiatan] = useState({})
    const [dataPeserta, setDataPeserta] = useState({})
    const [detailJadwal, setDetailJadwal] = useState([])
    const [showCamBack, setShowCamBack] = useState(false)

    // get sstatus absensi
    const getStatusAbsen = async () => {
        await fetch(`${BASE_URL}/peserta/pembinaan/${id_jadwal}/status_absen`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` }
        })
            .then(res => res.json())
            .then(data => {
                const dat = data.data;
                dispatch(setStatusPeserta(dat));
            })
            .catch(err => {
                console.log(err)
            })
    }

    // get detail Pembinaan sekarang
    const getDetailKegiatan = async () => {
        await fetch(`${BASE_URL}/peserta/pembinaan/${id_jadwal}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` }
        })
            .then(res => res.json())
            .then(data => {
                const dat = data.data;
                setDetailJadwal(dat)
            })
            .catch(err => {
                console.log(err)
            })
    }

    // get details pembinaan
    const getDetailPembinaan = async () => {
        await fetch(`${BASE_URL}/peserta/pembinaan/${id_jadwal}/detail`, {
            method: 'GET',
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` }
        })
            .then(res => res.json())
            .then((res) => {
                setdataKegiatan(res.data)
            })
            .catch((err) => {
                console.error('error get detail pembinaan', err)
            })
    }

    // get data peserta
    const getDataPeserta = async () => {
        await fetch(`${BASE_URL}/peserta/pembinaan`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` }
        })
            .then(res => res.json())
            .then((data) => {
                setDataPeserta(data.data[0])
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // handle cekin 
    const handleSelfie = async (io) => {
        //kondisi jika cout
        if (io == 'cout') {
            let time = new Date;
            let epoch = Math.round(time.getTime() / 1000)
            // jika belum waktu absen
            if (epoch < stateStatusPeserta.time_cout) {
                // parsing epoct to readable datetime 
                let time_cout = epochPrettyDate(stateStatusPeserta.time_cout, 'hh:mm:ss');
                return notify({ place: 'br', message: `Belum bisa akhiri kegiatan, Kegiatan berakhir pada jam ${time_cout}`, color: 'warning' })
            }
            // jika sudah waktu absen maka update state show kamera
            else {
                // hanya jika kamera off
                if (!showCamBack) {
                    return setShowCamBack(true)
                }
            }
        }
        // const foto = webcamRef.current.getScreenshot({width: 1920, height: 1080});
        const foto = "assets/img/photo-1431578500526-4d9613015464.jpeg";
        await fetch(`${BASE_URL}/peserta/pembinaan/presensi`, {
            method: 'POST',
            body: JSON.stringify({ io, foto, id_jadwal }),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` }
        })
            .then(res => res.json())
            .then((data) => {
                // update foto
                notify({ place: 'br', message: data.meta.message, color: 'success' })
                getStatusAbsen()
            })
            .catch((err) => {
                console.error('error saat absensi', err)
            })
    }

    // handle show up modal
    const notify = ({ place, message, color }) => {
        var options = {};
        options = {
            place: place,
            message: (
                <div>
                    <div>
                        {message}
                    </div>
                </div>
            ),
            type: color,
            icon: "nc-icon nc-bell-55",
            autoDismiss: 5,
        };
        notificationAlertRef.current.notificationAlert(options);
    };

    // component mulai kegiatan 
    const MulaiKegiatan = () => {
        // jika sudah absen
        if (stateStatusPeserta.is_cin) {
            return (
                <img
                    alt="Foto Cek-In"
                    // src={`${ATT_IMG}${stateStatusPeserta.data_absen.foto_cekin}`}
                    src={
                        require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                            .default
                    }
                ></img>
            );
        }
        // jika belum melakukan absen
        else {
            return (
                <div className="embed-responsive embed-responsive-4by3">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        height='auto'
                        width='auto'
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                    />
                </div>
            );
        }


    }

    // component akhiri kegiatan
    const AkhiriKegiatan = () => {
        // state camera back active true maka tampilkan webcam
        if (showCamBack) {
            return (
                <div className="embed-responsive embed-responsive-4by3">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        height='auto'
                        width='auto'
                        screenshotFormat="image/jpeg"
                        imageSmoothing={true}
                    />
                </div>
            );
        }
        else {
            return (
                <img
                    alt="Foto Cek-Out"
                    // src={`${ATT_IMG}${stateStatusPeserta.data_absen.foto_cekout}`}
                    src={
                        require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                            .default
                    }
                ></img>
            );
        }

    }

    // list detail kegiatan
    const ListDetailJadwal = () => {
        
        if (detailJadwal.length > 0) {
            console.log(detailJadwal)
            return detailJadwal.map((val, index) =>  {
                return (
                    <tr key={index}>
                        <td>{val.hari}</td>
                        <td>{val.tipe_sesi}</td>
                        <td>{val.tipe_sesi}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                        <td>{index}</td>
                    </tr>
                );
            });

            
        }
        else {
            return (
                <tr>
                    <td colSpan="18">No Data Here...</td>
                </tr>
            );
            
            
        }
    }

    useEffect(() => {
        getDetailPembinaan();
        getStatusAbsen();
        getDataPeserta();
        getDetailKegiatan();
    }, [])
    return (
        <>
            <div className="rna-container">
                <NotificationAlert ref={notificationAlertRef} />
            </div>
            <Container fluid>
                <Row>
                    <Col md="8">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Kegiatan {dataKegiatan.nama_kgt}</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <table className="table">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Tanggal : {dataKegiatan.current_date}</th>
                                                <th scope="col">Hari Ke : {dataKegiatan.active_day}</th>
                                            </tr>
                                            <tr>
                                                <th scope="col">Nama Koordinator : {dataKegiatan.koor?.nama}</th>
                                                <th scope="col">HP Koordinator : {dataKegiatan.koor?.hp_wa}</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </Row>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <div className="card">
                                            <MulaiKegiatan />
                                            <div className="card-body">
                                                <div className="button-container mr-auto ml-auto text-center">
                                                    {
                                                        stateStatusPeserta.is_cin ?
                                                            stateStatusPeserta.data_absen.jam_cekin
                                                            :
                                                            <Button
                                                                className="btn-fill"
                                                                type="submit"
                                                                variant="info"
                                                                onClick={() => {
                                                                    handleSelfie('cin')
                                                                }}
                                                            >
                                                                Mulai Kegiatan
                                                        </Button>
                                                    }

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-6'>
                                        <div className="card">
                                            <AkhiriKegiatan />
                                            <div className="card-body">
                                                <div className="button-container mr-auto ml-auto text-center">
                                                    {

                                                        stateStatusPeserta.is_cout ?
                                                            stateStatusPeserta.data_absen.jam_cekout
                                                            :
                                                            <Button
                                                                className="btn-fill"
                                                                type="submit"
                                                                variant="warning"
                                                                onClick={() => {
                                                                    handleSelfie('cout')
                                                                }}
                                                            >
                                                                Akhiri Kegiatan
                                                        </Button>


                                                    }

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="clearfix"></div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="card-user">
                            <div className="card-image">
                                <img
                                    alt="..."
                                    src={
                                        require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                                            .default
                                    }
                                ></img>
                            </div>
                            <Card.Body>
                                <div className="author">
                                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                                        <img
                                            alt="Foto peserta"
                                            className="avatar border-gray"
                                            src={dataPeserta?.foto}
                                        ></img>
                                        <h5 className="title">{dataPeserta?.nama}</h5>
                                    </a>
                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item">PT Kings Landing</li>
                                    <li className="list-group-item">{dataPeserta?.email}</li>
                                </ul>
                            </Card.Body>
                            <hr></hr>
                            <div className="button-container mr-auto ml-auto">
                                <Button
                                    className="btn-fill m-2"
                                    type="submit"
                                    variant="success"
                                >
                                    Kelompok
                  </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
                {/* validasi jika sudah absen dan mengerjakan kuis maka render bellow */}
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className="card">
                            <div className="card-body">
                                {
                                    stateStatusPeserta.is_cin ?
                                        <div className="table-responsive-xl">
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Hari Ke</th>
                                                        <th>Sesi</th>
                                                        <th>Modul</th>
                                                        <th>Materi Ajar</th>
                                                        <th>Narasumber</th>
                                                        <th>Materi Tambah</th>
                                                        <th>Tugas Narasumber</th>
                                                        <th>Jawaban Tugas</th>
                                                        <th>Video PKL</th>
                                                        <th>Peserta</th>
                                                        <th>Kuis</th>
                                                        <th>Soal Labeling</th>
                                                        <th>Soal Cocokan</th>
                                                        <th>Soal Benar-Salah</th>
                                                        <th>Soal PG</th>
                                                        <th>Soal Essay</th>
                                                        <th>Hasil Ujian</th>
                                                        <th>Hasil Remedial</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <ListDetailJadwal />
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <Alert variant="danger">
                                            <span>Belum Klik Mulai Kegiatan!!</span>
                                        </Alert>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default BinaDetail
