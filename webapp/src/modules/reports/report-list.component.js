import React from 'react';
import { ReportItem } from './report-item.component';
import { useQuery } from '@apollo/react-hooks';
import { GET_REPORTS } from './report-item.query';


export const ReportList = () => {
    
    const { loading, error, data } = useQuery(GET_REPORTS);

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    };

    if (error) {
        return (
            <div>Wyjebało errora, elo</div>
        );
    };

    if (data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px'}}>
                {data.findAllReports.map((rep) => {
                    return <ReportItem report={rep} key={rep._id} ></ReportItem>
                })}
            </div>
        );
    }
};