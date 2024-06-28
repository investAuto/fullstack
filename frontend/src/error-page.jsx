import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <div id="error-page" style={{ color: 'black' }}>
            <h1>Oops!</h1>
            <p>Ошибка</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
