export const formatDate = date => {
  const dateObject = new Date(date);
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1;
  const day = dateObject.getDate();

  const formattedMonth = month.toString().length === 1 ? "0" + month : month;
  const formattedDate = day.toString().length === 1 ? "0" + day : day;

  return `${year}-${formattedMonth}-${formattedDate}`;
};

export const events = {
  MOVIE_ADDED: "MOVIE_ADDED",
  MOVIE_DELETED: "MOVIE_DELETED",
  MOVIE_UPDATED: "MOVIE_UPDATED"
};
