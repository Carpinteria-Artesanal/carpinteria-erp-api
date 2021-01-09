const supertest = require('supertest');
const {
        mongoose,
        ClientModel,
        ClientInvoiceModel,
        AutoIncrement,
      } = require('arroyo-erp-models');
const testDB = require('../../../../test/test-db')(mongoose);
const requestLogin = require('../../../../test/request-login');
const app = require('../../../../index');
const {
        commonErrors,
        invoiceErrors,
        clientErrors,
        deliveryOrderErrors,
      } = require('../../../../errors');

const invoiceMock = {
  taxBase: 200.73,
  iva: 95.01,
  total: 295.74,
  date: 1594474393373,
  nInvoice: '20-22',
  deliveryOrders: [
    {
      date: 1609439904890,
      products: [
        {
          name: 'Producto',
          weight: 112.2,
          unit: 'Kg',
          price: 1.23,
          total: 198.23,
        },
      ],
    },

  ],
};

const clientMock = {
  name: 'Cliente 11',
  address: 'C/Una, 9',
  city: 'Alcazar',
  postalCode: '13600',
  province: 'CRc',
  phone: '654456321',
  email: 'ed@ss.es',
  businessName: 'Nombre SL',
  cif: 'B777',
};

describe('ClientInvoicesController', () => {
  beforeAll(() => testDB.connect());
  afterAll(() => testDB.disconnect());

  describe('POST /client/invoices', () => {
    const PATH = '/client/invoices';
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH)
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('El cliente no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .send({
              client: '5f7e138c15e88854b95b3cad',
            })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();
          expect(response.status)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('Se crea la factura correctamente', () => {
        let response;
        let client;

        before(() => ClientModel.create({
          name: 'Cliente',
        })
          .then(clientCreated => {
            client = clientCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH)
            .send({
              client: client._id,
            })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un id', () => {
          expect(response.body.id)
            .toBeTruthy();
        });
      });
    });
  });

  describe('GET /client/invoices/short', () => {
    const PATH = '/client/invoices/short';
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH)
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('El cliente no existe', () => {
        let response;

        before(done => {
          supertest(app)
            .get(PATH)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.status)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new clientErrors.ClientIdNotFound().message);
        });
      });

      describe('El cliente existe', () => {
        let response;
        let client;

        before(() => ClientModel.create({ name: 'Cliente' })
          .then(clientCreated => {
            client = clientCreated;
          }));

        describe('Sin facturas', () => {
          before(done => {
            supertest(app)
              .get(`${PATH}?client=${client._id}`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.status)
              .toBe(200);
          });

          test('No devuelve facturas', () => {
            expect(response.body.count)
              .toBe(0);
            expect(response.body.invoices.length)
              .toBe(0);
          });
        });

        describe('Dispone de facturas', () => {
          before(() => ClientInvoiceModel.create({
            client: client._id,
            date: new Date().getTime(),
          }));
          before(() => ClientInvoiceModel.create({
            ...invoiceMock,
            client: client._id,
          }));

          before(done => {
            supertest(app)
              .get(`${PATH}?client=${client._id}&offset=1&limit=1`)
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(response.status)
              .toBe(200);
          });

          test('Devuelve las facturas', () => {
            expect(response.body.count)
              .toBe(2);
            expect(response.body.invoices[0].date)
              .toBe(invoiceMock.date);
            expect(response.body.invoices[0].total)
              .toBe(invoiceMock.total);
            expect(response.body.invoices[0].nInvoice)
              .toBe(invoiceMock.nInvoice);
          });
        });
      });
    });
  });

  describe('GET /client/invoices', () => {
    const PATH = '/client/invoices';
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH)
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      let client;

      before(() => ClientModel.create({ name: 'Cliente' })
        .then(clientCreated => {
          client = clientCreated;
        }));

      describe('El año no es válido', () => {
        let response;
        before(done => {
          supertest(app)
            .get(`${PATH}?year=asd`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(response.status)
            .toBe(400);
        });

        test('No devuelve facturas', () => {
          expect(response.body.message)
            .toBe(new commonErrors.ParamNotValidError().message);
        });
      });

      describe('Sin facturas', () => {
        let response;
        before(done => {
          supertest(app)
            .get(`${PATH}?year=2020`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('No devuelve facturas', () => {
          expect(response.body.length)
            .toBe(0);
        });
      });

      describe('Dispone de facturas', () => {
        let response;
        before(() => ClientInvoiceModel.create({
          client: client._id,
          date: 1609355546762,
        }));

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          client: client._id,
        }));

        before(done => {
          supertest(app)
            .get(`${PATH}?year=2020`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('Devuelve las facturas', () => {
          expect(response.body.length)
            .toBe(2);
          expect(response.body[1].date)
            .toBe(invoiceMock.date);
          expect(response.body[1].total)
            .toBe(invoiceMock.total);
          expect(response.body[1].nInvoice)
            .toBe(invoiceMock.nInvoice);
        });
      });
    });
  });

  describe('GET /client/invoices/:id', () => {
    const PATH = id => `/client/invoices/${id}`;
    before(() => testDB.clean());

    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH('none'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      let client;

      before(() => ClientModel.create({ name: 'Cliente' })
        .then(clientCreated => {
          client = clientCreated;
        }));

      describe('La factura no existe', () => {
        let response;
        before(done => {
          supertest(app)
            .get(PATH('5ed7e0548eb012d630aa258c'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.status)
            .toBe(404);
        });

        test('No devuelve facturas', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('Devuelve los datos de la factura', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          client: client._id,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        before(done => {
          supertest(app)
            .get(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(response.status)
            .toBe(200);
        });

        test('Los datos son correctos', () => {
          expect(response.body.client)
            .toBe(client._id.toString());
          expect(response.body.date)
            .toBe(invoiceMock.date);
          expect(response.body.nInvoice)
            .toBe(invoiceMock.nInvoice);
          expect(response.body.total)
            .toBe(invoiceMock.total);
          // TODO
          /* expect(response.body.taxBase)
            .toBe(invoiceMock.taxBase);
          expect(response.body.iva)
            .toBe(invoiceMock.iva); */
          expect(response.body.deliveryOrders[0].date)
            .toBe(invoiceMock.deliveryOrders[0].date);
          expect(response.body.deliveryOrders[0].products[0].name)
            .toBe(invoiceMock.deliveryOrders[0].products[0].name);
          expect(response.body.deliveryOrders[0].products[0].weight)
            .toBe(invoiceMock.deliveryOrders[0].products[0].weight);
          expect(response.body.deliveryOrders[0].products[0].unit)
            .toBe(invoiceMock.deliveryOrders[0].products[0].unit);
          expect(response.body.deliveryOrders[0].products[0].price)
            .toBe(invoiceMock.deliveryOrders[0].products[0].price);
          expect(response.body.deliveryOrders[0].products[0].total)
            .toBe(invoiceMock.deliveryOrders[0].products[0].total);
        });
      });
    });
  });

  describe('PATCH /client/invoices/:id', () => {
    const PATH = id => `/client/invoices/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('No contiene fecha de la factura ni totales', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(400);
        });
      });

      describe('Actualiza los campos', () => {
        let response;
        let invoice;
        const date = 1594062299563;

        const invoiceTotals = {
          total: 12,
          iva: 10,
          taxBase: 3.6,
        };

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        const testData = () => {
          expect(response.body.date)
            .toBe(date);
        };

        const testTotals = () => {
          const { totals } = response.body;
          expect(totals.total)
            .toBe(invoiceTotals.total);
          expect(totals.iva)
            .toBe(invoiceTotals.iva);
          expect(invoiceTotals.taxBase)
            .toBe(invoiceTotals.taxBase);
        };

        describe('Se actualiza data y totals', () => {
          beforeAll(done => {
            supertest(app)
              .patch(PATH(invoice._id))
              .send({
                date,
                totals: invoiceTotals,
              })
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(token)
              .toBeTruthy();
            expect(response.statusCode)
              .toBe(200);
          });

          test('Se ha actualizado data', () => {
            testData();
          });

          test('Se ha actualizado los totales', () => {
            testTotals();
          });
        });

        describe('Se actualiza fecha', () => {
          beforeAll(done => {
            supertest(app)
              .patch(PATH(invoice._id))
              .send({
                date,
              })
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(token)
              .toBeTruthy();
            expect(response.statusCode)
              .toBe(200);
          });

          test('Se han actualizado data', () => {
            testData();
          });
        });

        describe('Se actualiza los totales', () => {
          beforeAll(done => {
            supertest(app)
              .patch(PATH(invoice._id))
              .send({
                totals: invoiceTotals,
              })
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 200', () => {
            expect(token)
              .toBeTruthy();
            expect(response.statusCode)
              .toBe(200);
          });

          test('Se ha actualizado los totales', () => {
            testTotals();
          });
        });
      });
    });
  });

  describe('DELETE /client/invoices/:id', () => {
    const PATH = id => `/client/invoices/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(PATH('5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('El id de la factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .delete(PATH('5ef26172ccfd9d1541b870be'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.status)
            .toBe(404);
        });
      });

      describe('El id de la factura existe y está confirmada', () => {
        let response;
        let invoice;

        beforeAll(() => ClientInvoiceModel.create(invoiceMock)
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        describe('No es la ultima factura', () => {
          beforeAll(() => AutoIncrement.create({
            name: 'clientInvoice2020',
            seq: 1,
          }));

          afterAll(() => testDB.clean('AutoIncrement'));

          beforeAll(done => {
            supertest(app)
              .delete(PATH(invoice._id))
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 400', () => {
            expect(response.status)
              .toBe(400);
          });

          test('El mensaje de error es correcto', () => {
            expect(response.body.message)
              .toBe(new invoiceErrors.InvoiceNoRemovable().message);
          });
        });

        describe('Es la última factura', () => {
          beforeAll(() => AutoIncrement.create({
            name: 'clientInvoice2020',
            seq: 22,
          }));

          afterAll(() => testDB.clean('AutoIncrement'));

          beforeAll(done => {
            supertest(app)
              .delete(PATH(invoice._id))
              .set('Authorization', `Bearer ${token}`)
              .end((err, res) => {
                response = res;
                done();
              });
          });

          test('Debería dar un 204', () => {
            expect(response.status)
              .toBe(204);
          });
        });
      });

      describe('La factura no está confirmada', () => {
        let response;
        let invoice;

        beforeAll(async () => {
          const invoiceData = {
            ...invoiceMock,
          };
          delete invoiceData.nInvoice;

          await ClientInvoiceModel.create(invoiceData)
            .then(invoiceCreated => {
              invoice = invoiceCreated;
            });
        });

        beforeAll(done => {
          supertest(app)
            .delete(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 204', () => {
          expect(response.status)
            .toBe(204);
        });
      });
    });
  });

  describe('PATCH /client/invoices/:id/confirm', () => {
    const PATH = id => `/client/invoices/${id}/confirm`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('No contiene fecha', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({})
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceInvalidDateInvoice().message);
        });
      });

      describe('Se genera un nuevo número de factura', () => {
        let response;
        let invoice;
        const date = 1594062299563;

        const invoiceTotals = {
          total: 12,
          iva: 10,
          taxBase: 3.6,
        };

        beforeAll(() => AutoIncrement.create({
          name: 'clientInvoice2020',
          seq: 12,
        }));

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          nInvoice: undefined,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id))
            .send({
              date,
              totals: invoiceTotals,
            })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.statusCode)
            .toBe(200);
        });

        test('Devuelve un número de factura', () => {
          expect(response.body.nInvoice)
            .toBe('20-13');
        });
      });
    });
  });

  describe('POST /client/invoices/:id/deliveryOrder', () => {
    const PATH = id => `/client/invoices/${id}/deliveryOrder`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH('5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH('5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('Añade un albarán', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.status)
            .toBe(200);
        });

        test('Contiene un albarán nuevo', () => {
          const deliveryOrder = response.body.deliveryOrders.pop();
          expect(deliveryOrder.date)
            .toBeNull();
          expect(deliveryOrder.total)
            .toBe(0);
          expect(deliveryOrder.products.length)
            .toBe(0);
        });
      });
    });
  });

  describe('PATCH /client/invoices/:id/deliveryOrder/:order', () => {
    const PATH = (id, order) => `/client/invoices/${id}/deliveryOrder/${order}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5ef26172ccfd9d1541b870be', '5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5f761ae5a7d8986bc28ff7f4', '5ef26172ccfd9d1541b870be'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('El albarán no existe', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id, '5ef26172ccfd9d1541b870be'))
            .send()
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('La fecha es inválida', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id, invoice.deliveryOrders[0]._id))
            .send()
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new commonErrors.DateNotValid().message);
        });
      });

      describe('Se actualiza la fecha', () => {
        let invoice;
        let response;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id, invoice.deliveryOrders[0]._id))
            .send({ date: 1609676354374 })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 204', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(204);
        });
      });
    });
  });

  describe('DELETE /client/invoices/:id/deliveryOrder/:order', () => {
    const PATH = (id, order) => `/client/invoices/${id}/deliveryOrder/${order}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(PATH('5ef26172ccfd9d1541b870be', '5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .delete(PATH('5f761ae5a7d8986bc28ff7f4', '5ef26172ccfd9d1541b870be'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('El albarán no existe', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(invoice._id, '5ef26172ccfd9d1541b870be'))
            .send()
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('El albarán tiene productos', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [{
              unit: 'kg',
              total: 10,
            }],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(invoice._id, invoice.deliveryOrders[0]._id))
            .send()
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNoRemovable().message);
        });
      });

      describe('Se borra el albarán', () => {
        let invoice;
        let response;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(invoice._id, invoice.deliveryOrders[0]._id))
            .send({ date: 1609676354374 })
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 204', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(204);
        });
      });
    });
  });

  describe('POST /client/invoices/:id/deliveryOrder/:order/products', () => {
    const PATH = (id, order) => `/client/invoices/${id}/deliveryOrder/${order}/product`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .post(PATH('5ef26172ccfd9d1541b870be', '5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .post(PATH('5f761ae5a7d8986bc28ff7f4', '5ef26172ccfd9d1541b870be'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('El albarán no existe', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH(invoice._id, '5ef26172ccfd9d1541b870be'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe.each([
        'unit', 'name', 'price', 'weight',
      ])('No se envía %s', (item => {
        let response;
        let invoice;
        const productMock = {
          unit: 'Kg',
          name: 'Producto',
          price: 2.34,
          weight: 3.43,
        };

        before(async () => {
          await ClientInvoiceModel.create({
            date: Date.now(),
            deliveryOrders: [{
              date: null,
              total: 0,
              products: [],
            }],
          })
            .then(invoiceCreated => {
              invoice = invoiceCreated;
            });
        });

        beforeAll(done => {
          delete productMock[item];
          supertest(app)
            .post(PATH(invoice._id, invoice.deliveryOrders[0]._id))
            .send(productMock)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceParamsMissing().message);
        });
      }));

      describe('Añade un producto', () => {
        let invoice;
        let response;
        const productMock = {
          unit: 'Kg',
          name: 'Producto',
          price: 2.34,
          weight: 3.43,
        };

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .post(PATH(invoice._id, invoice.deliveryOrders[0]._id))
            .send(productMock)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(200);
        });

        test('El producto se ha añadido', () => {
          const product = response.body.deliveryOrders[0].products[0];
          expect(product.name)
            .toBe(productMock.name);
          expect(product.unit)
            .toBe(productMock.unit);
          expect(product.price)
            .toBe(productMock.price);
          expect(product.weight)
            .toBe(productMock.weight);
        });
      });
    });
  });

  describe('PATCH /client/invoices/:id/deliveryOrder/:order/product/:product', () => {
    const PATH = (id, order, product) => `/client/invoices/${id}/deliveryOrder/${order}/product/${product}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .patch(PATH('5ef26172ccfd9d1541b870be', '5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .patch(PATH('5f761ae5a7d8986bc28ff7f4', '5ef26172ccfd9d1541b870be', '5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('El albarán no existe', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(invoice._id, '5ef26172ccfd9d1541b870be', '5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe.each([
        'unit', 'name', 'price', 'weight',
      ])('No se envía %s', (item => {
        let response;
        let invoice;
        const productMock = {
          unit: 'Kg',
          name: 'Producto',
          price: 2.34,
          weight: 3.43,
        };

        before(async () => {
          await ClientInvoiceModel.create({
            date: Date.now(),
            deliveryOrders: [{
              date: null,
              total: 0,
              products: [{
                unit: 'unid',
                name: 'Producto 2',
                price: 3.77,
                weight: 1.11,
              }],
            }],
          })
            .then(invoiceCreated => {
              invoice = invoiceCreated;
            });
        });

        beforeAll(done => {
          delete productMock[item];
          supertest(app)
            .patch(PATH(
              invoice._id,
              invoice.deliveryOrders[0]._id,
              invoice.deliveryOrders[0].products[0]._id,
            ))
            .send(productMock)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 400', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(400);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceParamsMissing().message);
        });
      }));

      describe('Edita un producto', () => {
        let invoice;
        let response;
        const productMock = {
          unit: 'Kg',
          name: 'Producto',
          price: 2.34,
          weight: 3.43,
        };

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [{
              unit: 'unid',
              name: 'Producto 2',
              price: 3.77,
              weight: 1.11,
            }],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .patch(PATH(
              invoice._id,
              invoice.deliveryOrders[0]._id,
              invoice.deliveryOrders[0].products[0]._id,
            ))
            .send(productMock)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(200);
        });

        test('El producto se ha añadido', () => {
          const product = response.body.deliveryOrders[0].products[0];
          expect(product.name)
            .toBe(productMock.name);
          expect(product.unit)
            .toBe(productMock.unit);
          expect(product.price)
            .toBe(productMock.price);
          expect(product.weight)
            .toBe(productMock.weight);
        });
      });
    });
  });

  describe('DELETE /client/invoices/:id/deliveryOrder/:order/product/:product', () => {
    const PATH = (id, order, product) => `/client/invoices/${id}/deliveryOrder/${order}/product/${product}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .delete(PATH('5ef26172ccfd9d1541b870be', '5ef26172ccfd9d1541b870be'))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;
      before(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .delete(PATH('5f761ae5a7d8986bc28ff7f4', '5ef26172ccfd9d1541b870be', '5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(token)
            .toBeTruthy();

          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('El albarán no existe', () => {
        let response;
        let invoice;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(invoice._id, '5ef26172ccfd9d1541b870be', '5f761ae5a7d8986bc28ff7f4'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(token)
            .toBeTruthy();

          expect(response.statusCode)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new deliveryOrderErrors.DeliveryOrderNotFound().message);
        });
      });

      describe('Elimina un producto', () => {
        let invoice;
        let response;

        before(() => ClientInvoiceModel.create({
          date: Date.now(),
          deliveryOrders: [{
            date: null,
            total: 0,
            products: [{
              unit: 'unid',
              name: 'Producto 2',
              price: 3.77,
              weight: 1.11,
            }],
          }],
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .delete(PATH(
              invoice._id,
              invoice.deliveryOrders[0]._id,
              invoice.deliveryOrders[0].products[0]._id,
            ))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();

          expect(response.status)
            .toBe(200);
        });

        test('El producto se ha añadido', () => {
          const products = response.body.deliveryOrders[0].products.length;
          expect(products)
            .toBe(0);
        });
      });
    });
  });

  describe('GET /client/invoices/export/:id', () => {
    const PATH = id => `/client/invoices/export/${id}`;
    describe('Usuario no autenticado', () => {
      let response;

      beforeAll(done => {
        supertest(app)
          .get(PATH(2000))
          .end((err, res) => {
            response = res;
            done();
          });
      });

      test('Debería dar un 401', () => {
        expect(response.statusCode)
          .toBe(401);
      });
    });

    describe('Usuario autenticado', () => {
      let token;

      beforeAll(done => {
        requestLogin()
          .then(res => {
            token = res;
            done();
          });
      });

      test('Se ha autenticado el usuario', () => {
        expect(token)
          .toBeTruthy();
      });

      describe('La factura no existe', () => {
        let response;

        beforeAll(done => {
          supertest(app)
            .get(PATH('5ff1ddd77dee043cfc99b8d5'))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 404', () => {
          expect(response.status)
            .toBe(404);
        });

        test('El mensaje de error es correcto', () => {
          expect(response.body.message)
            .toBe(new invoiceErrors.InvoiceIdNotFound().message);
        });
      });

      describe('La petición se procesa correctamente', () => {
        let response;
        let client;
        let invoice;

        before(() => ClientModel.create(clientMock)
          .then(clientCreated => {
            client = clientCreated;
          }));

        before(() => ClientInvoiceModel.create({
          ...invoiceMock,
          client: client._id,
        })
          .then(invoiceCreated => {
            invoice = invoiceCreated;
          }));

        beforeAll(done => {
          supertest(app)
            .get(PATH(invoice._id))
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              response = res;
              done();
            });
        });

        test('Debería dar un 200', () => {
          expect(token)
            .toBeTruthy();
          expect(response.status)
            .toBe(200);
        });
      });
    });
  });
});