import * as React from 'react';
import * as firebase from 'firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// import $ from 'jquery';
export interface IAppProps {}

export interface IAppState {
  dataFromPostsTable: any[];
}

export default class ShowPost extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      dataFromPostsTable: []
    };
  }
  componentDidMount() {
    let ref = firebase.database().ref('contact');
    ref
      .once('value')
      .then(res => {
        let tempArray: any[] = [];
        tempArray = Object.keys(res.val()).map(el => res.val()[el]);

        this.setState({
          dataFromPostsTable: tempArray
        });
      })
      .catch(err => {
        console.log(err);
        return this.setState({
          dataFromPostsTable: [{subject:'No Subject',name:'No Name',email:'No Email',message:'No Messages'}]
        });
      });
  }

  public render() {
    return (
      // <!-- Begin Page Content -->
      <div className='container-fluid'>
        <h1 className='h3 mb-2 text-gray-800'>Tables</h1>
        <p className='mb-4'>
          DataTables is a third party plugin that is used to generate the demo
          table below. For more information about DataTables, please visit the{' '}
          <a target='_blank' href='https://datatables.net' rel="noopener noreferrer">
            official DataTables documentation
          </a>
          .
        </p>

        {/* <!-- DataTales Example --> */}
        <div className='card shadow mb-4'>
          <div className='card-header py-3'>
            <h6 className='m-0 font-weight-bold text-primary'>
              DataTables Example
            </h6>
          </div>
          <div className='card-body'>
            <div className='table-responsive'>
              {this.state.dataFromPostsTable &&
              this.state.dataFromPostsTable.length > 0 ? (
                <table
                  className='table table-bordered'
                  id='dataTable'
                  style={{ width: '100%' }}
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Subject</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th>ID</th>
                      <th>Subject</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                    </tr>
                  </tfoot>
                  <tbody>
                    {this.state.dataFromPostsTable &&
                      this.state.dataFromPostsTable.length > 0 &&
                      this.state.dataFromPostsTable.map((data: any, index) => {
                        return (
                          <tr key={index * 198}>
                            <td>{index + 1}</td>
                            <td>{data.subject}</td>
                            <td>{data.name}</td>
                            <td>{data.email}</td>
                            <td>{data.message}</td>
                          </tr>
                        );
                      })}
                    {/* <tr>
                      <td>Tiger Nixon</td>
                      <td>System Architect</td>
                      <td>Edinburgh</td>
                      <td>61</td>
                      <td>2011/04/25</td>
                    </tr>
                    <tr>
                      <td>Garrett Winters</td>
                      <td>Accountant</td>
                      <td>Tokyo</td>
                      <td>63</td>
                      <td>2011/07/25</td>
                    </tr>
                    <tr>
                      <td>Ashton Cox</td>
                      <td>Junior Technical Author</td>
                      <td>San Francisco</td>
                      <td>66</td>
                      <td>2009/01/12</td>
                    </tr>
                    <tr>
                      <td>Cedric Kelly</td>
                      <td>Senior Javascript Developer</td>
                      <td>Edinburgh</td>
                      <td>22</td>
                      <td>2012/03/29</td>
                    </tr> */}
                  </tbody>
                </table>
              ) : (
                <div
                  className='spinner-grow'
                  style={{ width: '3rem', height: '3rem' }}
                  role='status'
                >
                  <span className='sr-only'>Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      // <!-- /.container-fluid -->
    );
  }
}
