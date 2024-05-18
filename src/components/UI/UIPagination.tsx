type Props = {
  onNext: () => void;
  onPrev: () => void;
  page: number;
  totalPages: number;
};

const UIPagination: React.FC<Props> = ({
  onNext,
  onPrev,
  page,
  totalPages,
}) => {
  return (
    <>
      <button
        onClick={onPrev}
        disabled={page === 1}
        className={`bg-gray-900 p-2 w-24  rounded-lg ${
          page === 1
            ? "cursor-not-allowed bg-opacity-95 text-gray-500"
            : "bg-opacity-35"
        }`}
      >
        Previous
      </button>
      <span className="mx-3 my-2">
        Page {page} of {totalPages}
      </span>
      <button
        className={`bg-gray-900 p-2 w-24  rounded-lg ${
          page === totalPages
            ? "cursor-not-allowed bg-opacity-95 text-gray-500"
            : "bg-opacity-35"
        }`}
        onClick={onNext}
        disabled={page === totalPages}
      >
        Next
      </button>
    </>
  );
};

export default UIPagination;
