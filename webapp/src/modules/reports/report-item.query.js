import gql from 'graphql-tag';

export const GET_REPORTS = gql`
    query {
        findAllReports {
            _id
            description
            title
        }
    }
`; 
