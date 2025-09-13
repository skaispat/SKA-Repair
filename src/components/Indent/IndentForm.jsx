import React, { useEffect, useState } from "react";
import { Plus, X, Upload, Loader2Icon } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const IndentForm = ({ onSubmit, onCancel, taskList }) => {
  const [sheetData, setSheetData] = useState([]);
  const [doerName, setDoerName] = useState([]);
  const [giveByData, setGivenByData] = useState([]);
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const [selectedMachine, setSelectedMachine] = useState("");
  const [filteredSerials, setFilteredSerials] = useState([]);
  const [filteredDepartment, setFilteredDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [machineLocation, setMachineLocation] = useState([]);
  const [location, setLocation] = useState("");
  const [userManualFile, setUserManualFile] = useState(null);
  const [machinePartName, setMachinePartName] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTaskDate, setEndTaskDate] = useState("");
  const [availableFrequencies, setAvailableFrequencies] = useState([]);

  const [selectedSerialNo, setSelectedSerialNo] = useState("");
  const [selectedGivenBy, setSelectedGivenBy] = useState("");
  const [selectedDoerName, setSelectedDoerName] = useState("");
  const [selectedTaskType, setSelectedTaskType] = useState("Select Task Type");
  const [needSoundTask, setNeedSoundTask] = useState("");
  const [temperature, setTemperature] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [description, setPromblemInMachine] = useState("");
  const [machineArea, setMachineArea] = useState("");
  const [partName, setPartName] = useState("");

  const [loaderSheetData, setLoaderSheetData] = useState(false);
  const [loaderSubmit, setLoaderSubmit] = useState(false);
  const [loaderMasterSheetData, setLoaderMasterSheetData] = useState(false);

  const [enableReminder, setEnableReminder] = useState(false);
  const [requireAttachment, setRequireAttachment] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Updated URLs and IDs for data fetching (Maintenance)
  const DATA_FETCH_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzWDU77ND7kYIIf__m_v3hlFv74-lF68mgSMjb0OadKnNU4XJFr74zAqnDQG0FARtjd/exec";
  const DATA_SHEET_ID = "1lE5TdGcbmwVcVqbx-jftPIdmoGgg1DApNn4t9jZvGN8";

  // URLs and IDs for data submission(Repair System)
  const SUBMIT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0ofs6yopMfqLgA3V33EHh44kXR_rrqrf1hUKARLToPPhEtYhCIgt4ZOEktAVwgc1PIQ/exec";
  const SUBMIT_SHEET_ID = "1NdI3kxXlyPdflmWr3Da53Dt9YHGRVRylm3naJLNWNHE";
  const FOLDER_ID = "1bBEcDO50JUOcBgpR8e-4bATMRbYGx00U";

  const fetchSheetData = async () => {
    const SHEET_NAME = "FormResponses";
    try {
      setLoaderSheetData(true);
      const res = await fetch(
        `${DATA_FETCH_SCRIPT_URL}?sheetId=${DATA_SHEET_ID}&sheet=${SHEET_NAME}`
      );
      const result = await res.json();

      if (result.success && result.table) {
        const headers = result.table.cols.map((col) => col.label);
        const rows = result.table.rows;

        const formattedRows = rows.map((rowObj) => {
          const row = rowObj.c;
          const rowData = {};
          row.forEach((cell, i) => {
            rowData[headers[i]] = cell.v;
          });
          return rowData;
        });

        setSheetData(formattedRows);
      } else {
        console.error("Server error:", result.message || result.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoaderSheetData(false);
    }
  };

  const fetchMasterSheetData = async () => {
    const SHEET_NAME = "Master";
    try {
      setLoaderMasterSheetData(true);
      const res = await fetch(
        `${DATA_FETCH_SCRIPT_URL}?sheetId=${DATA_SHEET_ID}&sheet=${SHEET_NAME}`
      );
      const result = await res.json();

      if (result.success && result.table) {
        const headers = result.table.cols.map((col) => col.label);
        const rows = result.table.rows;

        const formattedRows = rows.map((rowObj) => {
          const row = rowObj.c;
          const rowData = {};
          row.forEach((cell, i) => {
            rowData[headers[i]] = cell.v;
          });
          return rowData;
        });

        const DoerNameData = formattedRows.map((item) => item["Doer Name"]);
        setDoerName(DoerNameData);
        const giveBy = formattedRows.map((item) => item["Given By"]);
        setGivenByData(giveBy);
        const taskStatus = formattedRows.map((item) => item["Task Status"]);
        setTaskStatusData(taskStatus);
        const priority = formattedRows.map((item) => item["Priority"]);
        setPriorityData(priority);
        const department = formattedRows.map((item) => item["Department"]);
        setDepartmentData(department);
      } else {
        console.error("Server error:", result.message || result.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoaderMasterSheetData(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
    fetchMasterSheetData();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInDays = (end - start) / (1000 * 60 * 60 * 24);

      let frequencies = [];
      if (diffInDays >= 365) {
        frequencies = [
          "one-time",
          "Daily",
          "Weekly",
          "Monthly",
          "Quarterly",
          "Half Yearly",
          "Yearly",
        ];
      } else if (diffInDays >= 180) {
        frequencies = [
          "one-time",
          "Daily",
          "Weekly",
          "Monthly",
          "Quarterly",
          "Half Yearly",
        ];
      } else if (diffInDays >= 90) {
        frequencies = ["one-time", "Daily", "Weekly", "Monthly", "Quarterly"];
      } else if (diffInDays >= 30) {
        frequencies = ["one-time", "Daily", "Weekly", "Monthly"];
      } else if (diffInDays >= 7) {
        frequencies = ["one-time", "Daily", "Weekly"];
      } else if (diffInDays > 0) {
        frequencies = ["one-time", "Daily"];
      }

      setAvailableFrequencies(frequencies);
    } else {
      setAvailableFrequencies([]);
    }
  }, [startDate, endDate]);

  const uploadFileToDrive = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Data = reader.result;

        try {
          const res = await fetch(SUBMIT_SCRIPT_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              action: "uploadFile",
              base64Data: base64Data,
              fileName: file.name,
              mimeType: file.type,
              folderId: FOLDER_ID,
            }).toString(),
          });

          const data = await res.json();

          console.log("FileUploadData", data);

          if (data.success && data.fileUrl) {
            resolve(data.fileUrl);
          } else {
            toast.error("❌ File upload failed");
            resolve("");
          }
        } catch (err) {
          console.error("Upload error:", err);
          toast.error("❌ Upload failed due to network error");
          resolve("");
        }
      };

      reader.onerror = () => {
        reject("❌ Failed to read file");
      };

      reader.readAsDataURL(file);
    });
  };

  const clearFormState = () => {
    setSelectedSerialNo("");
    setSelectedMachine("");
    setSelectedGivenBy("");
    setSelectedDoerName("");
    setSelectedTaskType("Select Task Type");
    setStartDate("");
    setEndDate("");
    setEndTaskDate("");
    setStartTime("");
    setEndTime("");
    setPromblemInMachine("");
    setSelectedPriority("");
    setMachinePartName("");
    setLocation("");
    setMachineArea("");
    setPartName("");
    setNeedSoundTask("");
    setTemperature("");
    setEnableReminder(false);
    setRequireAttachment(false);
    setUserManualFile(null);
    setFilteredSerials([]);
    setSelectedDepartment("");
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!selectedMachine || !selectedSerialNo || !selectedDoerName || !selectedGivenBy) {
      toast.error("❌ Please fill in all required fields");
      return;
    }

    try {
      setLoaderSubmit(true);

      // Upload file first if exists
      let userManualUrl = "";
      if (userManualFile) {
        userManualUrl = await uploadFileToDrive(userManualFile);
      }

      const formPayload = new FormData();
      formPayload.append("sheetName", "Repair System");

      // For Repair tasks, send as single insert
      formPayload.append("action", "insert1");

      // Prepare single task data without generating task number
      const taskData = {
        "Time Stemp": new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
        "Serial No": selectedSerialNo,
        "Machine Name": selectedMachine,
        "Given By": selectedGivenBy,
        "Doer Name": selectedDoerName,
        "Enable Reminders": enableReminder ? "Yes" : "No",
        "Require Attachment": requireAttachment ? "Yes" : "No",
        "Task Start Date": `${startDate} ${startTime}:00`,
        "Task Ending Date": `${endTaskDate} ${endTime}:00`,
        "Problem With Machine": description,
        Department: selectedDepartment,
        Location: location,
        "Machine Part Name": machinePartName,
        "Image Link": userManualUrl || "link not available",
        Priority: selectedPriority,
      };

      // Append all fields individually to formData
      Object.entries(taskData).forEach(([key, value]) => {
        formPayload.append(key, value);
      });

      // Submit to the correct sheet URL
      const response = await fetch(`${SUBMIT_SCRIPT_URL}?headerRow=5`, {
        method: "POST",
        body: formPayload,
      });

      const result = await response.json();
      
      if (result.success || response.ok) {
        toast.success("✅ Task assigned successfully!");
        
        // Clear form state
        clearFormState();
        
        // Call onSubmit to refresh the parent component's data
        if (onSubmit) {
          onSubmit();
        }
        
        // Close modal
        onCancel();
      } else {
        throw new Error(result.message || "Submission failed");
      }

    } catch (error) {
      console.error("❌ Submission failed:", error);
      toast.error("❌ Something went wrong during submission.");
    } finally {
      setLoaderSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Machine Name Dropdown */}
        <div>
          <label
            htmlFor="machineName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Machine Name *
          </label>
          <select
            id="machineName"
            value={selectedMachine}
            onChange={(e) => {
              const selected = e.target.value;
              setSelectedMachine(selected);
              const serials = sheetData
                .filter((item) => item["Machine Name"] === selected)
                .map((item) => item["Serial No"]);
              setFilteredSerials(serials);
            }}
            className="w-full py-2 rounded-md border border-gray-300 shadow-sm px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Machine</option>
            {loaderSheetData ? (
              <option className="flex gap-5 items-center justify-center">
                <Loader2Icon className="animate-spin text-red-500" />
                <h1>Wait Please...</h1>
              </option>
            ) : (
              <>
                {[...new Set(sheetData.map((item) => item["Machine Name"]))]
                  .filter(Boolean)
                  .map((machineName, index) => (
                    <option key={index} value={machineName}>
                      {machineName}
                    </option>
                  ))}
              </>
            )}
          </select>
        </div>

        {/* Serial No Related to Machine Name */}
        {selectedMachine && !loaderSheetData && (
          <div className="">
            <label
              htmlFor="serialNo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Serial Number *
            </label>
            <select
              id="serialNo"
              value={selectedSerialNo}
              onChange={(e) => {
                setSelectedSerialNo(e.target.value);

                const department = sheetData
                  .filter((item) => item["Serial No"] === e.target.value)
                  .map((item) => item["Department"]);
                setFilteredDepartment(department);

                const location = sheetData
                  .filter((item) => item["Serial No"] === e.target.value)
                  .map((item) => item["Location"]);
              }}
              className="py-2 w-full rounded-md border border-gray-300 shadow-sm px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Serial No</option>
              {filteredSerials.map((serial, idx) => (
                <option key={idx} value={serial}>
                  {serial}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Doer's Name */}
        <div>
          <label
            htmlFor="doerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Doer's Name *
          </label>
          <select
            id="doerName"
            value={selectedDoerName}
            onChange={(e) => setSelectedDoerName(e.target.value)}
            className="py-2 rounded-md w-full border border-gray-300 shadow-sm px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Doer Name</option>
            {loaderMasterSheetData ? (
              <option className="flex gap-5 items-center justify-center">
                <Loader2Icon className="animate-spin text-red-500" />
                <h1>Wait Please...</h1>
              </option>
            ) : (
              doerName.map(
                (item, index) =>
                  item && (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
              )
            )}
          </select>
        </div>

        {/* Given By */}
        <div>
          <label
            htmlFor="givenBy"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Given By *
          </label>
          <select
            id="givenBy"
            value={selectedGivenBy}
            onChange={(e) => setSelectedGivenBy(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Given By</option>
            {loaderMasterSheetData ? (
              <>
                <option className="flex gap-5 items-center justify-center">
                  <Loader2Icon className="animate-spin text-red-500" />
                  <h1>Wait Please...</h1>
                </option>
              </>
            ) : (
              giveByData.map(
                (item, index) =>
                  item && (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
              )
            )}
          </select>
        </div>

        {/* Department */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Department
          </label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="py-2 w-full rounded-md border border-gray-300 shadow-sm px-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Department</option>
            {loaderMasterSheetData ? (
              <option className="flex gap-5 items-center justify-center">
                <Loader2Icon className="animate-spin text-red-500" />
                <h1>Wait Please...</h1>
              </option>
            ) : (
              departmentData.map(
                (item, index) =>
                  item && (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
              )
            )}
          </select>
        </div>

        {/* Machine Part Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Machine Part Name
          </label>
          <input
            type="text"
            name="machinePartName"
            value={machinePartName}
            onChange={(e) => setMachinePartName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Priority</option>
            {loaderMasterSheetData ? (
              <option className="flex gap-5 items-center justify-center">
                <Loader2Icon className="animate-spin text-red-500" />
                <h1>Wait Please...</h1>
              </option>
            ) : (
              priorityData.map(
                (item, index) =>
                  item && (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  )
              )
            )}
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Task Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        {/* Task Start Time */}
        <div>
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Task Start Time
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        {/* End Date */}
        <div>
          <label
            htmlFor="endTaskDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Task End Date
          </label>
          <input
            type="date"
            id="endTaskDate"
            value={endTaskDate}
            onChange={(e) => setEndTaskDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>

        {/* Task End Time */}
        <div>
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            Task End Time
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Problem With Machine
        </label>
        <textarea
          id="description"
          onChange={(e) => setPromblemInMachine(e.target.value)}
          value={description}
          rows={4}
          className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Machine Problem..."
        />
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* upload Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image of the Machine
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors duration-200">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                <span>Upload a file</span>
                <input
                  type="file"
                  name="imageOfTheMachine"
                  onChange={(e) => setUserManualFile(e.target.files[0])}
                  className="sr-only"
                  accept="image/*"
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            {userManualFile && (
              <p className="text-sm text-green-600 mt-2">
                Selected: {userManualFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="enableReminders"
            checked={enableReminder}
            onChange={() => setEnableReminder((prev) => !prev)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Enable Reminders</span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            name="requireAttachment"
            checked={requireAttachment}
            onChange={() => setRequireAttachment((prev) => !prev)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Require Attachment</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loaderSubmit}>
          {loaderSubmit && <Loader2Icon className="animate-spin mr-2" />}
          Save Indent
        </Button>
      </div>
    </form>
  );
};

export default IndentForm;