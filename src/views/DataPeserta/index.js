import { BASE_URL } from "api";
import React, { useEffect, useState } from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  Table,
  InputGroup
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setFormDataPeserta } from "./redux";
import Select from "react-select";
import { FcImageFile } from "react-icons/fc";
import { ModalImage } from "components/Modal";
import NotificationAlert from "react-notification-alert";

const DataPeserta = () => {

  const localAuth = JSON.parse(localStorage.getItem('p3sAuth'));
  const dispatch = useDispatch();
  const notificationAlertRef = React.useRef(null);
  const stateDataPeserta = useSelector(state => state.DataPesertaReducer);
  const jenis_kelamin = [
    {
      label: 'Laki-Laki',
      value: 'L',
    },
    {
      label: 'Perempuan',
      value: 'P',
    }
  ]
  const [dataProvinsi, setDataProvinsi] = useState([])
  const [dataKota, setDataKota] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState({
    title: null,
    body: null,
    show: false
  });
  const [defaultProv, setdefaultProv] = useState({})
  const [defaultKota, setDefaultKota] = useState({})
// console.log(defaultProv)
  // handle onclick btn simpan
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    let formData = new FormData();
    for (const key in stateDataPeserta) {
      if (key === 'foto' || key === 'f_ktp' || key === 'f_cv' || key === 'f_npwp' || key === 'f_pernyataan' || key === 'f_sukes') {
        // console.log(`${key}`, typeof stateDataPeserta[key])
        if (typeof stateDataPeserta[key] === 'object') {
          if (stateDataPeserta[key]) {
            formData.append(key, stateDataPeserta[key], stateDataPeserta[key].name);
          }
        }
      }
      else {
        formData.append(key, stateDataPeserta[key]);
      }
      // console.log(`ini ${key}`, typeof stateDataPeserta[key])
    }
    await fetch(`${BASE_URL}/peserta/data/master`, {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${localAuth.access_token}` },
    })
      .then(res => res.json())
      .then((data) => {
        // handle success
        // console.log(data)
        let config = {
          place : 'br',
          message : data.meta.message,
          color : 'info'
        }
        notify(config)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        let config = {
          place : 'br',
          message : 'error while sending data',
          color : 'danger'
        }
        notify(config)
        setIsLoading(false)
      })
  }

  // handle field text change
  const handleOnChange = (e) => {
    let type = e.target.type;
    let name = e.target.name;
    let value = null;
    switch (type) {
      case 'text':
        value = e.target.value;
        break;
      case 'date':
        value = e.target.value;
        break;
      case 'file':
        value = e.target.files[0];
        break;
      case 'select-one':
        value = e.target.value;
        break;
    }
    dispatch(setFormDataPeserta(name, value))
  }

  // handle react select on change
  const handleSelectOnChange = (name, e) => {
    // console.log(`${name} : ${e.value} is selected`)
    if (name === 'prov') {
      getKotaByProv(e.value)
    }
    dispatch(setFormDataPeserta(name, e.value))
  }

  // get kota by id provinsi
  const getKotaByProv = async (idProv) => {
    fetch(`${BASE_URL}/lov/kota/${idProv}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` },
    })
      .then(res => res.json())
      .then((data) => {
        // push data to array dataProvinis
        const dt = data.data;
        let dtTemp = [];
        for (const key in dt) {
          let newObj = {
            'label': dt[key].nama,
            'value': dt[key].id
          }
          dtTemp.push(newObj)
        }
        setDataKota(dtTemp)
        //  return data.data;
      })
      .catch((err) => {
        console.log(err)
      });
  }

  const getIndex = (idProv) => {
    return dataProvinsi.filter(op => op.value == idProv);
    // setDataProvinsi(ar_kota[0])
  }

  const getProvinsi = async () => {
    await fetch(`${BASE_URL}/lov/provinsi`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` },
    })
      .then(res => res.json())
      .then((data) => {
        // push data to array dataProvinis
        const dt = data.data;
        let dtProv = [];
        for (const key in dt) {
          let newObj = {
            'label': dt[key].nama,
            'value': dt[key].id
          }
          dtProv.push(newObj)
        }
        setDataProvinsi(dtProv)
        //  return data.data;
      })
      .catch((err) => {
        console.log(err)
      });
  }

  const getDataMaster = async () => {
    await fetch(`${BASE_URL}/peserta/data/master`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': `Bearer ${localAuth.access_token}` },
    })
      .then(res => res.json())
      .then((data) => {
        const dataPeserta = data.data
        getKotaByProv(dataPeserta.prov)
        for (const key in dataPeserta) {
          dispatch(setFormDataPeserta(key, dataPeserta[key]))
          // console.log(`${key} : ${dataPeserta[key]}`)
        }
        // binding all data to form
      })
      .catch((err) => {
        console.log(err)
      });
  }

  // notification
  const notify = ({place, message, color}) => {
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
      autoDismiss: 7,
    };
    notificationAlertRef.current.notificationAlert(options);
  };


  // use effect get data first
  useEffect(() => {
    getDataMaster();
    getProvinsi();
    // console.log(getIndex(17)[0])
  }, [])
  return (
    <>
      <div className="rna-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Header>
                <Card.Title as="h4">Data Peserta</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleOnSubmit} >
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>NIK KTP Peserta</label>
                        <Form.Control
                          defaultValue={stateDataPeserta.nik}
                          name="nik"
                          onChange={handleOnChange}
                          placeholder="Nomor Induk Kependudukan"
                          disabled={stateDataPeserta.nik ? true : false}
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Nama Peserta</label>
                        <Form.Control
                          defaultValue={stateDataPeserta.nama}
                          name="nama"
                          onChange={handleOnChange}
                          placeholder="Nama Lengkap (Tanpa Gelar)"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group controlId="jenis_kelamin">
                        <Form.Label>Jenis Kelamin</Form.Label>
                        <Form.Control as="select" custom name="jenis_kelamin" onChange={handleOnChange} defaultValue={stateDataPeserta.jenis_kelamin}>
                          {
                            jenis_kelamin.map((jk, i) => (
                              <option key={i} value={jk.value} >{jk.label}</option>
                            ))
                          }
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Tempat Lahir</label>
                        <Form.Control
                          defaultValue={stateDataPeserta.tmp_lahir}
                          name="tmp_lahir"
                          onChange={handleOnChange}
                          placeholder="Tempat Lahir"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Tanggal lahir</label>
                        <Form.Control
                          defaultValue={stateDataPeserta.tgl_lahir}
                          name="tgl_lahir"
                          onChange={handleOnChange}
                          type="date"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          NO HP/WA
                        </label>
                        <Form.Control
                          defaultValue={stateDataPeserta.no_hp}
                          name="no_hp"
                          onChange={handleOnChange}
                          placeholder="08xxxx"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>Provinsi (Sesuai KTP) {stateDataPeserta.prov}</label>
                        <Select
                          name="prov"
                          // defaultValue={{label: "RIAU", value: 14}}
                          options={dataProvinsi}
                          onChange={(e) => handleSelectOnChange('prov', e)}
                          // value={stateDataPeserta.prov}
                          defaultValue={() => {
                            let a = dataProvinsi.filter(op => op.value == stateDataPeserta.prov)[0]
                            return {label: a.label, value: a.value}
                          }}
                          placeholder='Provinsi Sesuai KTP'
                        />
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Kota (Sesuai KTP)</label>
                        <Select
                          name="kota"
                          onChange={(e) => handleSelectOnChange('kota', e)}
                          options={dataKota}
                          defaultValue={() => { dataKota[getIndex(stateDataPeserta.kota)] }}
                          placeholder='Kota Sesuai KTP'
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">
                          Email
                        </label>
                        <Form.Control
                          defaultValue={stateDataPeserta.email}
                          name="email"
                          onChange={handleOnChange}
                          placeholder="Email"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="8">
                      <Form.Group>
                        <label>Alamat (Sesuai KTP)</label>
                        <Form.Control
                          defaultValue={stateDataPeserta.alamat_ktp}
                          name="alamat_ktp"
                          onChange={handleOnChange}
                          placeholder="Jalan, Kelurahan, Kecamatan"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>Keterangan</label>
                        <Form.Control
                          name="keterangan"
                          onChange={handleOnChange}
                          defaultValue={stateDataPeserta.keterangan}
                          placeholder="(optional)"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>File KTP
                          {
                            stateDataPeserta.f_ktp ?
                              <FcImageFile onClick={() => setShowModal({
                                ...showModal,
                                title: `File KTP ${stateDataPeserta.nama}`,
                                body: stateDataPeserta.f_ktp,
                                show: true
                              })} />
                              :
                              ''
                          }
                        </label>
                        <Form.File
                          custom
                          id="custom-file-ktp"
                          label="File KTP"
                          lang="en"
                          name="f_ktp"
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-muted">
                          format: png, jpg, jpeg.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>File Foto
                          {
                            stateDataPeserta.foto ?
                              <FcImageFile onClick={() => setShowModal({
                                ...showModal,
                                title: `File Foto ${stateDataPeserta.nama}`,
                                body: stateDataPeserta.foto,
                                show: true
                              })} />
                              :
                              ''
                          }
                        </label>
                        <Form.File
                          custom
                          id="custom-file-foto"
                          label="File Foto"
                          lang="en"
                          name="foto"
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-muted">
                          format: png, jpg, jpeg.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>File CV
                          {
                            stateDataPeserta.f_cv ?
                              <FcImageFile onClick={() => setShowModal({
                                ...showModal,
                                title: `File CV ${stateDataPeserta.nama}`,
                                body: stateDataPeserta.f_cv,
                                show: true
                              })} />
                              :
                              ''
                          }
                        </label>
                        <Form.File
                          custom
                          id="custom-file-cv"
                          label="File CV"
                          lang="en"
                          name="f_cv"
                          onChange={handleOnChange}
                        />
                        <Form.Text className="text-muted">
                          format: png, jpg, jpeg.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <label htmlFor="exampleInputEmail1">
                        NPWP
                        {
                          stateDataPeserta.f_npwp ?
                            <FcImageFile onClick={() => setShowModal({
                              ...showModal,
                              title: `File NPWP ${stateDataPeserta.nama}`,
                              body: stateDataPeserta.f_npwp,
                              show: true
                            })} />
                            :
                            ''
                        }
                      </label>
                      <InputGroup size="sm" className="mb-3">
                        <Form.Control
                          name="npwp"
                          onChange={handleOnChange}
                          placeholder="no Npwp"
                          defaultValue={stateDataPeserta.npwp}
                          type="text"
                        >
                        </Form.Control>
                        <Form.Group>
                          <Form.File
                            id="custom-file-npwp"
                            label="Upload NPWP"
                            name='f_npwp'
                            onChange={handleOnChange}
                            lang="en"
                            custom
                          />
                        </Form.Group>
                      </InputGroup>
                    </Col>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>
                          File Pernyataan
                        {
                            stateDataPeserta.f_pernyataan ?
                              <FcImageFile onClick={() => setShowModal({
                                ...showModal,
                                title: `File NPWP ${stateDataPeserta.nama}`,
                                body: stateDataPeserta.f_pernyataan,
                                show: true
                              })} />
                              :
                              ''
                          }
                        </label>
                        <Form.File
                          id=""
                          label="File Surat Pernyataan"
                          lang="en"
                          name='f_pernyataan'
                          onChange={handleOnChange}
                          custom
                        />
                        <Form.Text className="text-muted">
                          format: pdf
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>File Suket Sehat
                        {
                            stateDataPeserta.f_sukes ?
                              <FcImageFile onClick={() => setShowModal({
                                ...showModal,
                                title: `File Surat Keterangan Sehat ${stateDataPeserta.nama}`,
                                body: stateDataPeserta.f_sukes,
                                show: true
                              })} />
                              :
                              ''
                          }
                        </label>
                        <Form.File
                          id=""
                          label="File Suket Sehat"
                          lang="en"
                          name='f_sukes'
                          onChange={handleOnChange}
                          custom
                        />
                        <Form.Text className="text-muted">
                          format: pdf
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      {
                        isLoading ?
                          <button className="btn-fill btn-info pull-right btn-sm" type="submit">
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
                            </button>
                          :
                          <Button
                            className="btn-fill pull-right btn-sm"
                            type="submit"
                            variant="info"
                          >
                            Simpan
                          </Button>
                      }

                    </Col>
                  </Row>
                  {/* section data sertifikat */}
                  <Row>
                    <Col md="12">
                      <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                          <Card.Title as="h4">Data Sertifikat</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                          <Table className="table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="border-0">ID</th>
                                <th className="border-0">Name</th>
                                <th className="border-0">Salary</th>
                                <th className="border-0">Country</th>
                                <th className="border-0">City</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Dakota Rice</td>
                                <td>$36,738</td>
                                <td>Niger</td>
                                <td>Oud-Turnhout</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Minerva Hooper</td>
                                <td>$23,789</td>
                                <td>Curaçao</td>
                                <td>Sinaai-Waas</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Sage Rodriguez</td>
                                <td>$56,142</td>
                                <td>Netherlands</td>
                                <td>Baileux</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  {/* data pendidikan */}
                  <Row>
                    <Col md="12">
                      <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                          <Card.Title as="h4">Data Pendidikan</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                          <Table className="table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="border-0">ID</th>
                                <th className="border-0">Name</th>
                                <th className="border-0">Salary</th>
                                <th className="border-0">Country</th>
                                <th className="border-0">City</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Dakota Rice</td>
                                <td>$36,738</td>
                                <td>Niger</td>
                                <td>Oud-Turnhout</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Minerva Hooper</td>
                                <td>$23,789</td>
                                <td>Curaçao</td>
                                <td>Sinaai-Waas</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Sage Rodriguez</td>
                                <td>$56,142</td>
                                <td>Netherlands</td>
                                <td>Baileux</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  {/* data pengalaman */}
                  <Row>
                    <Col md="12">
                      <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                          <Card.Title as="h4">Data Pengalaman</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                          <Table className="table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="border-0">ID</th>
                                <th className="border-0">Name</th>
                                <th className="border-0">Salary</th>
                                <th className="border-0">Country</th>
                                <th className="border-0">City</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Dakota Rice</td>
                                <td>$36,738</td>
                                <td>Niger</td>
                                <td>Oud-Turnhout</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Minerva Hooper</td>
                                <td>$23,789</td>
                                <td>Curaçao</td>
                                <td>Sinaai-Waas</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Sage Rodriguez</td>
                                <td>$56,142</td>
                                <td>Netherlands</td>
                                <td>Baileux</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  {/* data pelatihan */}
                  <Row>
                    <Col md="12">
                      <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                          <Card.Title as="h4">Data Pelatihan</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                          <Table className="table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="border-0">ID</th>
                                <th className="border-0">Name</th>
                                <th className="border-0">Salary</th>
                                <th className="border-0">Country</th>
                                <th className="border-0">City</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Dakota Rice</td>
                                <td>$36,738</td>
                                <td>Niger</td>
                                <td>Oud-Turnhout</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Minerva Hooper</td>
                                <td>$23,789</td>
                                <td>Curaçao</td>
                                <td>Sinaai-Waas</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Sage Rodriguez</td>
                                <td>$56,142</td>
                                <td>Netherlands</td>
                                <td>Baileux</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  {/* data studi kasus */}
                  <Row>
                    <Col md="12">
                      <Card className="strpied-tabled-with-hover">
                        <Card.Header>
                          <Card.Title as="h4">Data Studi Kasus</Card.Title>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                          <Table className="table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="border-0">ID</th>
                                <th className="border-0">Name</th>
                                <th className="border-0">Salary</th>
                                <th className="border-0">Country</th>
                                <th className="border-0">City</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Dakota Rice</td>
                                <td>$36,738</td>
                                <td>Niger</td>
                                <td>Oud-Turnhout</td>
                              </tr>
                              <tr>
                                <td>2</td>
                                <td>Minerva Hooper</td>
                                <td>$23,789</td>
                                <td>Curaçao</td>
                                <td>Sinaai-Waas</td>
                              </tr>
                              <tr>
                                <td>3</td>
                                <td>Sage Rodriguez</td>
                                <td>$56,142</td>
                                <td>Netherlands</td>
                                <td>Baileux</td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>




                  {/* default form from templates */}
                  {/* <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>First Name</label>
                        <Form.Control
                          defaultValue="Mike"
                          placeholder="Company"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="6">
                      <Form.Group>
                        <label>Last Name</label>
                        <Form.Control
                          defaultValue="Andrew"
                          placeholder="Last Name"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Address</label>
                        <Form.Control
                          defaultValue="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                          placeholder="Home Address"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="pr-1" md="4">
                      <Form.Group>
                        <label>City</label>
                        <Form.Control
                          defaultValue="Mike"
                          placeholder="City"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="px-1" md="4">
                      <Form.Group>
                        <label>Country</label>
                        <Form.Control
                          defaultValue="Andrew"
                          placeholder="Country"
                          type="text"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pl-1" md="4">
                      <Form.Group>
                        <label>Postal Code</label>
                        <Form.Control
                          placeholder="ZIP Code"
                          type="number"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>About Me</label>
                        <Form.Control
                          cols="80"
                          defaultValue="Lamborghini Mercy, Your chick she so thirsty, I'm in
                          that two seat Lambo."
                          placeholder="Here can be your description"
                          rows="4"
                          as="textarea"
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    className="btn-fill pull-right"
                    type="submit"
                    variant="info"
                  >
                    Update Profile
                  </Button> */}
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </Container>
      <ModalImage title={showModal.title} body={showModal.body} show={showModal.show} handleClose={() => { setShowModal(!showModal.show) }} />
    </>
  );
}

export default DataPeserta;
