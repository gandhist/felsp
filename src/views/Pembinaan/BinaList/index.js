import { BASE_URL } from 'api';
import React, {useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import {
    Button,
    Card,
    Table,
    Container,
    Row,
    Col,
  } from "react-bootstrap";
const BinaList = () => {

    // initial state
    const [listJadwal, setListJadwal] = useState([]);
    const localAuth = JSON.parse(localStorage.getItem('p3sAuth'));

    const getJadwal = async () => {
        await fetch(`${BASE_URL}/peserta/pembinaan`, {
            method: 'GET',
            headers: {'Content-Type' : 'application/json', 'Accept' : 'application/json', 'Authorization' : `Bearer ${localAuth.access_token}`}
        })
        .then(res => res.json())
        .then((data) => {
            setListJadwal(data.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        getJadwal();
    }, [])


    return (
        <>
        <Container fluid>
          <Row>
            <Col md="12">
              <Card className="strpied-tabled-with-hover">
                <Card.Header>
                  <Card.Title as="h4">Jadwal & Kegiatan Pembinaan PJK3 Mandiri untuk Peserta</Card.Title>
                </Card.Header>
                <Card.Body className="table-full-width table-responsive px-0">
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">No</th>
                        <th className="border-0">PJK3</th>
                        <th className="border-0">No Kegiatan</th>
                        <th className="border-0">Bidang</th>
                        <th className="border-0">Pembinaan</th>
                        <th className="border-0">Jadwal Kegiatan</th>
                        <th className="border-0">Koordinator</th>
                        <th className="border-0">Provinsi</th>
                        <th className="border-0">TUK</th>
                        <th className="border-0">Jumlah Peserta</th>
                        <th className="border-0">Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        listJadwal && listJadwal.map((val, index) => {
                          let jadwal = val.jadwal_r[0];
                          return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{jadwal.id}</td>
                                        <td><Link to={`pembinaan/${jadwal.id}`}> {jadwal.no_kgt} </Link></td>
                                        <td>{jadwal.id_bidang}</td>
                                        <td>{jadwal.id_sert_alat}</td>
                                        <td>{jadwal.tgl_awal} s/d {jadwal.tgl_akhir}</td>
                                        <td>{jadwal.id_koordinator}</td>
                                        <td>{jadwal.id_prov}</td>
                                        <td>{jadwal.id_tuk_tl} & {jadwal.id_tuk_o}</td>
                                        <td>{jadwal.id}</td>
                                        <td>-</td>
                                    </tr>
                                )
                        })
                      }
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    )
}

export default BinaList
