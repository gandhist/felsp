import React, {useRef, useEffect} from 'react'
import {
    Button,
    Card,
    Container,
    Row,
    Col,
    Alert
} from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';


const BinaDetail = () => {
    const dispatch = useDispatch();
    const stateStatusPeserta = useSelector(state => state.StatusPesertaReducer)
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const stripRef = useRef(null);

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({video : {width: 300}})
        .then(stream => {
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error("error webcam: ", err)
        })
    }

    const drawToCanvas = () => {
        let video = videoRef.current;
        let photo = photoRef.current;
        let ctx = photo.getContext("2d");

        const width = 320;
        const height = 240;
        photo.width = width;
        photo.height = height;
        return setInterval(() => {
            ctx.drawImage(video, 0, 0, width, height)
        }, 200)
    }

    const takePict = () => {
        let photo = photoRef.current;
        let strip = stripRef.current;

        const data = photo.toDataURL("image/jpeg");

        console.warn(data);
        const link = document.createElement("a");
        link.href = data;
        link.setAttribute("download", "myWebcam");
        link.innerHTML = `<img src='${data}' alt='thumbnail'/>`;
        strip.insertBefore(link, strip.firstChild);
    }

    useEffect(() => {
        getVideo();
    }, [videoRef])

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md="8">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Kegiatan Pembinaan Ahli Keselamatan dan Kesehatan Kerja Umum</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <table className="table">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th scope="col">Tanggal : 12 Januari 1990</th>
                                                <th scope="col">Hari Ke : 5</th>
                                            </tr>
                                            <tr>
                                                <th scope="col">Nama Koordinator : Ned Stark</th>
                                                <th scope="col">HP Koordinator : 085698598</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </Row>
                                <div className='row'>
                                    <div className='col-lg-6'>
                                        <div className="card">
                                            {
                                                stateStatusPeserta.is_cin ?
                                                <img
                                                alt="..."
                                                src={
                                                    require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                                                        .default
                                                }
                                            ></img>
                                            :
                                            <div>
                                            <video onCanPlay={() => drawToCanvas()} ref={videoRef} />
                                            <canvas />
                                            <div>
        <div ref={stripRef} />
      </div>
                                            </div>

                                            }
                                            
                                            <div className="card-body">
                                                <div className="button-container mr-auto ml-auto">
                                                    {
                                                        stateStatusPeserta.is_cin ?
                                                        stateStatusPeserta.data_absen.jam_cekin
                                                        :
                                                        <Button
                                                        className="btn-fill"
                                                        type="submit"
                                                        variant="info"
                                                        onClick={takePict}
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
                                            <img
                                                alt="..."
                                                src={
                                                    require("assets/img/photo-1431578500526-4d9613015464.jpeg")
                                                        .default
                                                }
                                            ></img>
                                            <div className="card-body">
                                                <div className="button-container mr-auto ml-auto">
                                                {
                                                        
                                                        stateStatusPeserta.is_cout ?
                                                        stateStatusPeserta.data_absen.jam_cekout
                                                        :
                                                        <Button
                                                        className="btn-fill"
                                                        type="submit"
                                                        variant="warning"
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
                                            alt="..."
                                            className="avatar border-gray"
                                            src={require("assets/img/faces/face-3.jpg").default}
                                        ></img>
                                        <h5 className="title">Mike Andrew</h5>
                                    </a>
                                </div>
                                <ul className="list-group">
                                    <li className="list-group-item">PT Kings Landing</li>
                                    <li className="list-group-item">213219412</li>
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
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Mark</td>
                                            <td>Otto</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                            <td>@mdo</td>
                                        </tr>
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
