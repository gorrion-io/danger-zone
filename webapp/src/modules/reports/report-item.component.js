import React from 'react';
import { Card } from 'antd';


export const ReportItem = (props) => {
    return (
        <Card title={props.report.title}>
            <p>{props.report.description}</p>
        </Card>
    );
}