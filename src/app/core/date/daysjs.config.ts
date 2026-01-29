import dayjs from 'dayjs';

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// locale
import 'dayjs/locale/es';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);

dayjs.locale('es');

export default dayjs;
