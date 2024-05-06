export function FormattedDate({ createdAt }) {
    const formattedDate = new Date(createdAt);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedDateStr = formattedDate.toLocaleDateString('en-US', options);

    return formattedDateStr;
}