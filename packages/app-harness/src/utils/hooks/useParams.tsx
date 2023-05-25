// type
export const useParams = (props: any) => {
    let params = {};
    // react-navigation
    if (props.route) {
        params = props.route.params.state;
    }
    // next/router
    else if (props.router) {
        params = props.router.query;
    }
    // Reach Router
    else if (props.location) {
        params = props.location.state;
    }
    return params;
};

export default useParams;
