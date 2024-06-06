import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PageProps {
    pageName: string;
    url: string;
}
  
function Page({ pageName, url }: PageProps) {
    const { t } = useTranslation();

    return (
        <li>
        <Link
            to={url}
            className="text-white hover:text-blue-200 transition duration-150 ease-in-out"
        >
            {t(pageName)}
        </Link>
        </li>
    );
}

export default Page;
