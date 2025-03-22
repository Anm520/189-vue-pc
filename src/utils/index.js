/**
 * 将字节数转换为更易于读取的文件大小格式
 *
 * @param {number} bytes - 文件的字节数
 * @return {string} 格式化后的文件大小字符串
 */
export function getFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 从给定字符串中提取特定格式的剧集编号
 * @param {string} str - 待搜索的字符串
 * @param {string} start - 剧集编号前的文本
 * @param {string} end - 剧集编号后的文本
 * @returns {number} - 提取到的剧集编号，如果未找到则返回0
 */
export function getEpisode(str, start, end) {
    // 初始化剧集编号为0
    let episode = 0
    // 构建正则表达式，用于匹配start和end之间的内容，不区分大小写
    const regex = new RegExp(`${start}(.*?)${end}`, 'i')
    // 尝试在输入字符串中匹配正则表达式
    const match = str.match(regex)
    if (match) {
        // 如果匹配成功，则解析并转换匹配到的剧集编号文本
        episode = parseInt(match[1].trim())
    } else {
        // 如果没有找到匹配项，则输出提示信息
        console.log('No match found')
    }
    // 返回提取到的剧集编号
    return episode
}

/* 隐藏手机号码    
* @param {string} phone - 手机号码
* @returns {string} - 隐藏后的手机号码
*/
export function hidePhone(phone) {
    const start = phone.slice(0, 3); // 前3位
    const end = phone.slice(-4);    // 后4位
    return `${start}****${end}`;
}