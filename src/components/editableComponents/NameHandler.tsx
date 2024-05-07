import UITextInput from "../UI/UITextInput";
import { useEditor } from "../contexts/EditorContext";

const NameHandler: React.FC = () => {
  const { mapData, setMapData } = useEditor();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapData({
      ...mapData,
      options: {
        ...mapData.options,
        name: e.target.value,
      },
    });
  };

  return (
    <>
      <h3 className="font-bold">Name :</h3>
      <UITextInput
        value={mapData.options.name}
        handleChange={handleNameChange}
        placeholder="Map name"
        maxLength={20}
      />
    </>
  );
};

export default NameHandler;
