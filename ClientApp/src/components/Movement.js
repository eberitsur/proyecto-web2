import { Component } from "react";
import {
    Button, Form, Navbar, Input, Card, CardBody, CardTitle, CardSubtitle,
    CardText, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Row, Col
} from "reactstrap";
import {
    BsPlusLg, BsSearch, BsBasketFill, BsBoxSeam, BsExclamationOctagon,
    BsListStars, BsInboxesFill, BsTable, BsPencilFill, BsFillTrashFill
} from "react-icons/bs";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/transactions.css';
import authService from './api-authorization/AuthorizeService';

export class Movement extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //Guardar datos
            data: [],
            suppliers: [],
            companies: [],
            employees: [],
            warehouses: [],
            products: [],
            //Tablas
            accion: 0,
            movementId: 0,
            dateMov: "",
            provName: null,//fk
            sourceWare: 0,//fk
            targetWare: null,//fk
            typeMov: "",
            notesMov: null,
            empId: 0,//fk
            compania: 1,
            productId: 0,
            quantity: null,
            movEditable: {},
            isUserValid: false,
            isGerente: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        authService.getUser().then(
            (u) => {
                const valo = authService.isValidUser(u);
                const role = authService.isGerente(u);
                this.setState({ isGerente: role });
                this.setState({ isUserValid: valo });
            }
        );

        authService.getAccessToken().then(
            (token) => {
                console.log("Token en GET: " + token);
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/movements', options).then((response) => {
                    return response.json();
                }).then((dataApi) => {
                    this.setState({ data: dataApi })
                    console.log(dataApi);
                }).catch(function (error) {
                    console.log(error);
                });
            }
        )

        //GET supplies data
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/suppliers', options).then((response) => {
                    return response.json();
                }).then((dataApi) => {
                    this.setState({ suppliers: dataApi })
                }).catch(function (error) {
                    console.log(error);
                })
            }
        )

        //GET campanies data
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/companies', options).then((response) => {
                    return response.json();
                }).then((dataApi) => {
                    this.setState({ companies: dataApi })
                }).catch(function (error) {
                    console.log(error);
                })
            }
        )

        //GET employees data
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/employees', options).then((response) => {
                    return response.json();
                }).then((dataApi) => {
                    this.setState({ employees: dataApi })
                }).catch(function (error) {
                    console.log(error);
                })
            }
        )

        //GET warehouses data
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/warehouses', options).then((response) => {
                    return response.json();
                }).then((dataApi) => {
                    this.setState({ warehouses: dataApi })
                }).catch(function (error) {
                    console.log(error);
                })
            }
        )

        //GET products data
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/products', options).then((response) => {
                    return response.json();
                }).then((dataApi) => {
                    this.setState({ products: dataApi })
                    //console.log(dataApi);
                }).catch(function (error) {
                    console.log(error);
                })
            }
        )
    }

    //Close modal, restores state values
    mitoggle = () => {
        this.setState({
            accion: 0,
            movementId: 0,
            dateMov: "",
            provName: null,
            sourceWare: 0,
            targetWare: null,
            typeMov: "",
            notesMov: null,
            empId: 0,
            compania: 1,
            productId: 0,
            quantity: 0
        });
    }

    //Changes state accion value to open Add Modal 
    mostrarInsertar = () => {
        this.setState({ accion: 1 });
    }

    mostrarError = () => {
        this.setState({ accion: 4 });
    }

    //Updates state values when inputs  
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleClick() {

        var movimiento = {
            movementId: 0, //
            date: this.state.dateMov, //
            supplierId: this.state.provName,
            originWarehouseId: this.state.sourceWare,
            targetWarehouseId: this.state.targetWare,
            type: this.state.typeMov,
            notes: this.state.notesMov,
            companyId: 1, //
            employeeId: this.state.empId
        }

        var fecha = this.state.dateMov + "T00:00:00.000Z"

        if (this.state.accion === 1) {

            movimiento.date = fecha;

            authService.getAccessToken().then(
                (token) => {
                    console.log("Token en POST: " + token);
                    const options = {
                        method: "POST",
                        headers: !token ? {} : {
                            'Authorization': `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(movimiento)
                    }
                    fetch('api/movements?productId=' + this.state.productId + "&quantity=" + this.state.quantity, options)
                        .then(
                            (response) => { return response.status; }
                        ).then(
                            (code) => {
                                if (code === 201) {
                                    console.log(code);
                                    const allMoves = Array.from(this.state.data);
                                    allMoves.push(movimiento);
                                    this.componentDidMount();
                                    this.mitoggle();
                                } else {
                                    this.mitoggle();
                                    this.mostrarError();
                                }
                            }
                        );
                }
            )
        }
        else if (this.state.accion === 2) {
            movimiento.movementId = this.state.movementId
            movimiento.date = fecha;
            movimiento.companyId = this.state.compania;

            authService.getAccessToken().then(
                (token) => {
                    const options = {
                        method: "PUT",
                        headers: !token ? {} : {
                            'Authorization': `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(movimiento)
                    }
                    fetch('/api/movements/' + this.state.movEditable.movementId, options)
                        .then(
                            (response) => { return response.status; }
                        ).then(
                            (code) => {
                                console.log(code);
                                if (code === 204) {
                                    console.log(code);
                                    const allMoves = Array.from(this.state.data);
                                    allMoves.push(movimiento);
                                    this.componentDidMount();
                                    this.mitoggle();
                                }
                            }
                        );
                }
            )
        }
        else if (this.state.accion === 3) {

            movimiento.movementId = this.state.movementId
            movimiento.companyId = this.state.compania;

            authService.getAccessToken().then(
                (token) => {
                    const options = {
                        method: "DELETE",
                        headers: !token ? {} : {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    fetch('/api/movements/' + this.state.movEditable.movementId, options)
                        .then(
                            (response) => { return response.status; }
                        ).then(
                            (code) => {
                                console.log("El código es: " + code);
                                if (code === 204 || code === 200) {
                                    console.log(code);
                                    const allMoves = Array.from(this.state.data);
                                    allMoves.pop(movimiento);
                                    this.componentDidMount();
                                    this.mitoggle();
                                }
                            }
                        );
                }
            )
        }

    }

    editar = (item) => {
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/movements/' + item.movementId, options)
                    .then(response => { return response.json() })
                    .then(o => {
                        console.log("primer fetch " + o);
                        this.setState({
                            accion: 2,
                            movementId: o.movementId,
                            dateMov: o.date.slice(0, 10),
                            provName: o.supplierId,//foranea
                            sourceWare: o.originWarehouseId,//foranea
                            targetWare: o.targetWarehouseId,//foranea
                            typeMov: o.type,
                            notesMov: o.notes,
                            empId: o.employeeId,//foranea
                            compania: o.companyId,
                            movEditable: o,
                        });
                    });
            }
        )
    }

    eliminar = (item) => {
        authService.getAccessToken().then(
            (token) => {
                const options = {
                    headers: !token ? {} : {
                        'Authorization': `Bearer ${token}`
                    }
                }
                fetch('/api/movements/' + item.movementId, options)
                    .then(response => { return response.json() })
                    .then(o => {
                        console.log(o);
                        this.setState({
                            accion: 3,
                            movementId: o.movementId,
                            dateMov: o.date.slice(0, 10),
                            provName: o.supplierId,//foranea
                            sourceWare: o.originWarehouseId,//foranea
                            targetWare: o.targetWarehouseId,//foranea
                            typeMov: o.type,
                            notesMov: o.notes,
                            empId: o.employeeId,//foranea
                            compania: o.companyId,
                            movEditable: o,
                        });
                    });
            }
        )
    }

    render() {
        return (
            <div>
                <div className="d-flex">
                    <div className="sidebar-container sidebar-color d-none d-md-block">
                        <div className="menu">
                            {/*<a href="/" className="d-block p-3 text-white active"><BsFillDiagram3Fill className="me-2 lead" /> Compañias</a>*/}
                            <a href="/suppliers" className="d-block p-3 text-white"><BsBasketFill className="me-2 lead" /> Proveedores</a>
                            <a href="/warehouses" className="d-block p-3 text-white"><BsInboxesFill className="me-2 lead" /> Almacenes</a>
                            <a href="/movements" className="d-block p-3 text-white selected"><BsTable className="me-2 lead" /> Movimientos</a>
                            <a href="/products" className="d-block p-3 text-white"><BsBoxSeam className="me-2 lead" /> Productos</a>
                            <a href="/categorys" className="d-block p-3 text-white"><BsListStars className="me-2 lead" /> Categorias</a>
                        </div>
                    </div>
                    <div className=" w-100">
                        <Navbar className="bg-light">
                            <div className="container">
                                <Form className="d-flex align-items-center position-relative w-75">
                                    <Input className="form-control me-2" type="search" placeholder="Buscar" aria-label="Search" />
                                    <Button className="btn btn-search position-absolute" type="submit"><BsSearch /></Button>
                                </Form>
                            </div>
                        </Navbar>
                        <div className="content">
                            <section className="py-5 px-3" style={{ backgroundColor: "#d3e0ef" }}>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-lg-9">
                                            <h1 className="fw-bold mb-0 text-dark">Tabla Movimientos:</h1>
                                        </div>
                                    </div>
                                </div>                           
                            </section>
                            <div style={{ backgroundcolor: "#0055FF" }}>
                                <div className="py-3 my-5 bg-light mx-5 px-3">
                                    {
                                        this.state.isUserValid &&
                                        <div>
                                            <Button color="secondary" onClick={this.mostrarInsertar}><BsPlusLg /> Agregar </Button>
                                        </div>
                                    }

                                    <table id="example" className="table dt-responsive nowrap align-middle px-2">
                                        <thead>
                                            <tr>
                                                <th>Clave</th>
                                                <th>Fecha</th>
                                                <th>Proovedor</th>
                                                <th>Almacen origen</th>
                                                <th>Almacen destino</th>
                                                <th>Tipo de movimiento</th>
                                                <th>Notas</th>
                                                <th>Empleado</th>
                                                {
                                                    this.state.isUserValid &&
                                                    <th className="text-center">Operacion</th>
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.data.map(movements =>
                                                    <tr key={movements.movementId}>
                                                        <th scope="row">{movements.movementId}</th>
                                                        <td>{movements.date}</td>
                                                        <td>{movements.supplierId}</td>
                                                        <td>{movements.originWarehouseId}</td>
                                                        <td>{movements.targetWarehouseId}</td>
                                                        <td>{movements.type}</td>
                                                        <td>{movements.notes}</td>
                                                        <td>{movements.companyId}</td>
                                                        {
                                                            this.state.isUserValid &&
                                                            <td className="text-center">
                                                                <div className="d-flex flex-row">
                                                                    <button type="button" className="btn btn-secondary" onClick={() => this.editar(movements)}>
                                                                        <BsPencilFill />
                                                                    </button>
                                                                    {
                                                                        !this.state.isGerente &&
                                                                        <button type="button" className="btn btn-danger" onClick={() => this.eliminar(movements)}>
                                                                            <BsFillTrashFill />
                                                                        </button>
                                                                    }
                                                                </div>
                                                            </td>
                                                        }
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    <div>
                                        <Modal
                                            isOpen={this.state.accion > 0 && this.state.accion < 3 && true}
                                            toggle={this.mitoggle}
                                            className={this.props.className}
                                            centered
                                        >
                                            <ModalHeader toggle={this.mitoggle} className="text-dark" close={<Button onClick={this.mitoggle} className="btn-close"></Button>}>Movimiento</ModalHeader>
                                            <ModalBody className="text-dark">
                                                <Form>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label for="movementId">ID movimiento</label>
                                                                <input id="movementId" name="movementId" type="text" className="form-control mb-3" placeholder="" disabled="true" value={this.state.movementId} />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={8}>
                                                            <FormGroup>
                                                                <label for="dateMov">Fecha del movimiento*</label>
                                                                <input id="dateMov" name="dateMov" type="date" className="form-control mb-3" onChange={this.handleChange} value={this.state.dateMov} />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <FormGroup>
                                                        <label for="provName">Proovedor</label>
                                                        <select id="provName" name="provName" class="form-select mb-3" aria-label="Default select example" onChange={this.handleChange} value={this.state.provName}>
                                                            <option>Selecciona...</option>
                                                            {
                                                                this.state.suppliers.map(s =>
                                                                    <option value={s.supplierId}>{s.companyName}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </FormGroup>

                                                    <Row>
                                                        <Col md={8}>
                                                            <FormGroup>
                                                                <label for="productId">Producto*</label>
                                                                <select id="productId" name="productId" class="form-select mb-3 " aria-label="Default select example" onChange={this.handleChange} value={this.state.productId}>
                                                                    <option>Selecciona...</option>
                                                                    {
                                                                        this.state.products.map(p =>
                                                                            <option class="text-dark" value={p.productId}>{p.productName}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <label for="quantity">Cantidad</label>
                                                                <input id="quantity" name="quantity" type="number" className="form-control mb-3" onChange={this.handleChange} value={this.state.quantity} />
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label for="sourceWare">Almacen origen*</label>
                                                                <select id="sourceWare" name="sourceWare" class="form-select mb-3" aria-label="Default select example" onChange={this.handleChange} value={this.state.sourceWare}>
                                                                    <option>Selecciona...</option>
                                                                    {
                                                                        this.state.warehouses.map(w =>
                                                                            <option value={w.warehouseId}>{w.description}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={6}>
                                                            <FormGroup>
                                                                <label for="targetWare">Almacen destino</label>
                                                                <select id="targetWare" name="targetWare" class="form-select mb-3" aria-label="Default select example" onChange={this.handleChange} value={this.state.targetWare} >
                                                                    <option>Selecciona...</option>
                                                                    {
                                                                        this.state.warehouses.map(w =>
                                                                            <option value={w.warehouseId}>{w.description}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>

                                                    <FormGroup>
                                                        <label for="typeMov">Tipo de movimiento*</label>
                                                        <select id="typeMov" name="typeMov" class="form-select mb-3" aria-label="Default select example" onChange={this.handleChange} value={this.state.typeMov} >
                                                            <option>Selecciona...</option>
                                                            <option value={'COMPRA'} >COMPRA</option>
                                                            <option value={'TRASPASO'}>TRASPASO</option>
                                                            <option value={'AJUSTE'}>AJUSTE</option>
                                                            <option value={'VENTA'}>VENTA</option>
                                                        </select>
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <label for="notesMov">Notas</label>
                                                        <Input id="notesMov" name="notesMov" type="textarea" className="mb-3" placeholder="" onChange={this.handleChange} value={this.state.notesMov} />
                                                    </FormGroup>

                                                    <FormGroup>
                                                        <label for="empId">Empleado*</label>
                                                        <select id="empId" name="empId" class="form-select mb-3" aria-label="Default select example" onChange={this.handleChange} value={this.state.empId}>
                                                            <option>Selecciona...</option>
                                                            {
                                                                this.state.employees.map(e =>
                                                                    <option value={e.employeeId}>{e.firstName + " " + e.lastName}</option>
                                                                )
                                                            }
                                                        </select>
                                                    </FormGroup>
                                                </Form>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button color="secondary" onClick={this.handleClick}>Agregar</Button>
                                                <Button color="warning" onClick={this.mitoggle}>Cancelar</Button>
                                            </ModalFooter>
                                        </Modal>

                                        <Modal
                                            isOpen={this.state.accion === 3 && true}
                                            centered
                                            toggle={this.mitoogle}>

                                            <ModalHeader className="text-dark" toggle={this.mitoogle}>
                                                Eliminar
                                            </ModalHeader>
                                            <ModalBody className="text-dark">
                                                ¿Desea elimninar?
                                                <Row>
                                                    <Col md={2}>
                                                        <FormGroup>
                                                            <label for="elimination">ID</label>
                                                            <input id="elimination" name="elimination" type="text" className="form-control mb-3" placeholder="" disabled="true" value={this.state.movementId} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md={10}>
                                                        <FormGroup>
                                                            <label for="movimiento">Tipo de movimiento</label>
                                                            <input id="movimiento" name="movimiento" type="text" className="form-control mb-3" placeholder="" disabled="true" value={this.state.typeMov} />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>

                                            </ModalBody>
                                            <ModalFooter>
                                                <Button
                                                    color="danger"
                                                    onClick={this.handleClick}
                                                >
                                                    Eliminar
                                                </Button>
                                                {' '}
                                                <Button onClick={this.mitoggle}>
                                                    Cancelar
                                                </Button>
                                            </ModalFooter>
                                        </Modal>

                                        <Modal
                                            isOpen={this.state.accion === 4 && true}
                                            centered
                                            toggle={this.mitoogle}
                                        >

                                            <ModalHeader className="text-dark" toggle={this.mitoogle} style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
                                                Error
                                            </ModalHeader>
                                            <ModalBody className="text-dark text-center" >
                                                <h1><BsExclamationOctagon /></h1>
                                                A ocurrido un error al agregar el movimiento
                                            </ModalBody>
                                            <ModalFooter>
                                                {' '}
                                                <Button onClick={this.mitoggle}>
                                                    Cerrar
                                                </Button>
                                            </ModalFooter>
                                        </Modal>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}