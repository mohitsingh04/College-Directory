import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddLoanProcess from './AddLoanProcess';
import EditLoanProcess from './EditLoanProcess';

export default function LoanProcess() {
  const [toggleLoanProcessPage, setToggleLoanProcessPage] = useState(true);
  const { uniqueId } = useParams();
  const [loanProcess, setLoanProcess] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const fetchLoanProcess = async () => {
      try {
        const response = await API.get(`/loan-process`);
        const filteredLoanProcess = response.data.filter((loanProcess) => loanProcess.propertyId === Number(uniqueId));
        setLoanProcess(filteredLoanProcess);
      } catch (error) {
        console.error('Error fetching loan process:', error);
      }
    };

    fetchLoanProcess();
  }, [uniqueId]);

  const handleHideLoanProcessPage = () => {
    setToggleLoanProcessPage(false);
  }

  const handleShowLoanProcessPage = () => {
    setToggleLoanProcessPage(true);
  }

  return (
    <div>
      <div id="profile-log-switch">
        <Card className="custom-card">
          <Card.Header className='flex justify-between'>
            <div className="media-heading">
              <h5>
                {loanProcess.length > 0
                  ?
                  toggleLoanProcessPage
                    ?
                    <strong>Loan Process</strong>
                    :
                    <strong>Edit Loan Process</strong>
                  :
                  <strong>Add Loan Process</strong>
                }
              </h5>
            </div>
            <div>
              {loanProcess.length > 0
                ?
                toggleLoanProcessPage ?
                  <button className="btn btn-primary btn-sm" title="Edit" onClick={handleHideLoanProcessPage}>
                    <i className="fe fe-edit"></i>
                  </button>
                  :
                  <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowLoanProcessPage}>
                    <i className="fe fe-x"></i>
                  </button>
                :
                null
              }
            </div>
          </Card.Header>
          <Card.Body>
            {loanProcess.length > 0
              ?
              toggleLoanProcessPage
                ?
                <>
                  {loanProcess[0]?.process.length >= 1500
                    ?
                    <>
                      <p
                        style={{ fontSize: "16px" }}
                        dangerouslySetInnerHTML={{
                          __html: isExpanded
                            ? loanProcess[0]?.process
                            : loanProcess[0]?.process.substring(0, 1500) + "...",
                        }}
                      />
                      <button onClick={toggleReadMore} className="text-blue-700 underline">
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    </>
                    :
                    <p
                      style={{ fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: loanProcess[0]?.process
                      }}
                    />
                  }
                </>
                :
                <EditLoanProcess
                  setLoanProcess={setLoanProcess}
                  setToggleLoanProcessPage={setToggleLoanProcessPage}
                />
              :
              <AddLoanProcess
                setLoanProcess={setLoanProcess}
                setToggleLoanProcessPage={setToggleLoanProcessPage}
              />
            }
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
