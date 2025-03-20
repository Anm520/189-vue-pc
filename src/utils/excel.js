import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// import FileReader from 'file-reader';
function exportToExcel (tableData, fileName = 'Export.xlsx') {
  const ws = XLSX.utils.json_to_sheet(tableData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  /* 生成 excel 文件 */
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  /* 下载 excel 文件 */
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName)
}
// 处理文件上传
const handleFileUpload =  (file) => {

  if (!file) return [];
  try {
    const reader = new FileReader();
    reader.onload = async function(e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // 解析工作表为JSON
      const arr =  XLSX.utils.sheet_to_json(worksheet);
      console.log(arr)
    };
    reader.readAsArrayBuffer(file);
  } catch (error) {
    console.error('Error reading file:', error);
    return []
  }
};
export default { exportToExcel,handleFileUpload }