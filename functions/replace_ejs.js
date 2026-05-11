const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.search, r.replace);
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

const loginReplacements = [
    { search: '<html lang="zh-Hant">', replace: '<html lang="<%= lang === \'zh-tw\' ? \'zh-Hant\' : lang === \'zh-cn\' ? \'zh-Hans\' : lang === \'ja-jp\' ? \'ja\' : \'en\' %>">' },
    { search: '<title>登入頁 - 明日方舟悠星服尋訪紀錄分析</title>', replace: '<title><%= t(\'login_title\') %></title>' },
    { search: '明日方舟悠星服尋訪紀錄分析\n      </div>', replace: '<%= t(\'main_heading\') %>\n      </div>' },
    { search: '<div class="tshJ_L">最新消息</div>', replace: '<div class="tshJ_L"><%= t(\'latest_news\') %></div>' },
    { search: '<strong>🌐 本網站僅支援悠星旗下之英、日、韓伺服器，點擊連結前往<a href="https://arknights-txwy-gacha.web.app" target="_blank" style="color: #1bd1fe; text-decoration: underline; padding: 0 0.2rem;">繁中服</a>、<a href="https://arkgacha.kwer.top/" target="_blank" style="color: #1bd1fe; text-decoration: underline; padding: 0 0.2rem;">簡中服</a>尋訪紀錄分析</strong>', replace: '<strong><%- t(\'news_content\') %></strong>' },
    { search: '方法一：Cookie（紀錄獲取）\n        </div>', replace: '<%= t(\'method_1_title\') %>\n        </div>' },
    { search: '<label class="input-label">伺服器 (Server)</label>', replace: '<label class="input-label"><%= t(\'server_label\') %></label>' },
    { search: '>日文服 (account.yostar.co.jp)<', replace: '><%= t(\'server_jp\') %><' },
    { search: '>英文服 (account.yo-star.com)<', replace: '><%= t(\'server_en\') %><' },
    { search: '>韓文服 (account.yostar.kr)<', replace: '><%= t(\'server_kr\') %><' },
    { search: '<label class="input-label">YSSID Cookie</label>', replace: '<label class="input-label"><%= t(\'cookie_label\') %></label>' },
    { search: '<label class="input-label">YSSID.sig</label>', replace: '<label class="input-label"><%= t(\'sig_label\') %></label>' },
    { search: '登入\n          </button>', replace: '<%= t(\'btn_login\') %>\n          </button>' },
    { search: '方法二：UID（已獲取紀錄查詢）\n        </div>', replace: '<%= t(\'method_2_title\') %>\n        </div>' },
    { search: '<label class="input-label">使用者 ID</label>', replace: '<label class="input-label"><%= t(\'uid_label\') %></label>' },
    { search: '方法三：JSON（上傳紀錄）\n        </div>', replace: '<%= t(\'method_3_title\') %>\n        </div>' },
    { search: '<label class="input-label">visit_logs.json 檔案</label>', replace: '<label class="input-label"><%= t(\'file_label\') %></label>' },
    { search: '上傳並登入\n          </button>', replace: '<%= t(\'btn_upload_login\') %>\n          </button>' },
    { search: '<div class="tshJ_L">使用說明</div>', replace: '<div class="tshJ_L"><%= t(\'instructions_title\') %></div>' },
    { search: '首次使用必須先獲取或上傳，以下是方法一（網站獲取）的使用說明：（需要瀏覽器的開發人員工具）<br />\n            請在<a href="https://account.yostar.co.jp" target="_blank">日文服官方網站</a>、<a href="https://account.yo-star.com" target="_blank">英文服官方網站</a>或<a href="https://account.yostar.kr" target="_blank">韓文服官方網站</a>登入後，使用 F12 開發人員工具，隨後在「應用程式／Application」找到「Cookie」中「YSSID」以及「YSSID.sig」的值並填入。<br />', replace: '<%- t(\'instructions_1\') %>' },
    { search: '本網站不會保留您的 Cookie，僅作為單次連線向官方伺服器調閱抽卡紀錄之過渡憑證。此憑證在伺服器用畢後即刻銷毀，絕不持久化儲存於任何資料庫中。不過，為避免任何風險，建議在完成獲取後回到上述之官方網站登出。', replace: '<%- t(\'instructions_2\') %>' },
    { search: '<div class="tshJ_L">關於本工具</div>', replace: '<div class="tshJ_L"><%= t(\'about_title\') %></div>' },
    { search: '本站是一個專為《明日方舟》悠星旗下英文、日文、韓文伺服器的玩家量身打造的<strong>抽卡紀錄導出、分析與視覺化統計工具</strong>。您可以從官方網站獲取您的抽卡歷史紀錄，或將過去的紀錄導入本站，支持資料從匯入、獲取、合併、暫存、匯出備份的一條龍服務。', replace: '<%- t(\'about_desc\') %>' },
    { search: '<strong>主要功能與特色包含：</strong><br>\n            • <strong>統計分析</strong>：自動計算各卡池（標準、中堅、限定）的已墊保底抽數、平均出金機率，並提供色彩豐富的分佈圖表。<br>\n            • <strong>資料管理</strong>：獲取紀錄後您可以隨時以 JSON 格式匯入、匯出、備份、覆蓋、清除，保障您的資料安全。<br>\n            • <strong>跨平台支援（開發中）</strong>：可透過多種登入方式（網頁、插件、APP、JSON 匯入、UID 查詢）輕鬆更新、查看您的數據。<br>', replace: '<%- t(\'about_features\') %>' },
    { search: '<div class="tshJ_L">注意事項</div>', replace: '<div class="tshJ_L"><%= t(\'warning_title\') %></div>' },
    { search: '1：本網站不保證任何資料的正確性或完整性，本網站不保證任何使用者的資料留存與否，本網站將不定時清除任意紀錄且不另行告知，請在每次查詢完成後自行將紀錄導出，若有刪除紀錄的需求，可使用「方法三：上傳 JSON」功能上傳空白檔案。', replace: '<%= t(\'warning_1\') %>' },
    { search: '2：請注意，由於方法二的存在，任何人都可以藉由你的 UID 訪問這裡的紀錄，若有顧慮請在完成獲取後及時刪除。', replace: '<%= t(\'warning_2\') %>' },
    { search: '3：請注意，由於方法三的存在，任何人都可以藉由你的 UID 覆蓋或刪除這裡的紀錄，請在查詢完成後及時將紀錄導出。', replace: '<%= t(\'warning_3\') %>' },
    { search: '4：如需在查詢過程中合併過往紀錄，請先使用「方法三：上傳 JSON」功能，將過往的 visit_logs.json 檔案上傳，登出後再使用「方法一：Cookie」登入。「方法二：Existing ID 登入」亦可用於檢查過往紀錄是否存在或完整。', replace: '<%= t(\'warning_4\') %>' },
    { search: '<div class="tshJ_L">免責聲明</div>', replace: '<div class="tshJ_L"><%= t(\'disclaimer_title\') %></div>' },
    { search: '1：本網站與遊戲公司（如鷹角網路、龍成網路、艾瑞爾網路、悠星網路或蒙塔山工作室）無任何關聯，也未經其授權。', replace: '<%= t(\'disclaimer_1\') %>' },
    { search: '2：任何使用本網站的人士，須自行承擔一切風險，網站作者不保證使用本網站不會違反任何機構的使用條款或任何地區的法律規範，網站作者不保證使用本網站不會造成任何個人資料的洩漏，網站作者不會負責任何因使用本網站而引致之損失，網站作者不會作出任何默示的擔保。', replace: '<%= t(\'disclaimer_2\') %>' },
    { search: '3：本網站僅供學術研究與個人用途，禁止用於任何商業用途或轉售。', replace: '<%= t(\'disclaimer_3\') %>' },
    { search: '4：網站內使用的遊戲圖片、動畫、音訊、文字原文、風格、樣式與部分版面設計，僅用於更好地表現遊戲資料，其版權屬於上海悠星網路科技有限公司、上海鷹角網路科技有限公司或以上之關聯公司。', replace: '<%= t(\'disclaimer_4\') %>' },
    { search: '正在抓取資料，請稍候…', replace: '<%= t(\'loading_text\') %>' },
    { search: 'alert("請選擇檔案");', replace: 'alert("<%= t(\'alert_no_file\') %>");' },
    { search: 'alert("上傳失敗: " + errorText);', replace: 'alert("<%= t(\'alert_upload_fail\') %>" + errorText);' },
    { search: 'alert("讀取檔案失敗或格式不正確: " + err.message);', replace: 'alert("<%= t(\'alert_read_fail\') %>" + err.message);' },
    { search: 'GitHub 原始碼', replace: '<%= t(\'github_code\') %>' },
    { search: '隱私權政策', replace: '<%= t(\'privacy_policy\') %>' },
    { search: '↑ 回到頁首', replace: '<%= t(\'back_to_top\') %>' },
    { search: '<div class="HgfD8Q" style="padding: 1.5rem; text-align: center">', replace: '<div style="position: absolute; top: 1rem; right: 1rem; z-index: 100;">\n      <select onchange="window.location.href=\'?lang=\'+this.value" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid #333; padding: 0.3rem; border-radius: 4px;">\n        <option value="zh-tw" <%= lang === \'zh-tw\' ? \'selected\' : \'\' %>>繁體中文</option>\n        <option value="zh-cn" <%= lang === \'zh-cn\' ? \'selected\' : \'\' %>>简体中文</option>\n        <option value="ja-jp" <%= lang === \'ja-jp\' ? \'selected\' : \'\' %>>日本語</option>\n        <option value="en-us" <%= lang === \'en-us\' ? \'selected\' : \'\' %>>English</option>\n      </select>\n    </div>\n    <!-- 大標題 -->\n    <div class="HgfD8Q" style="padding: 1.5rem; text-align: center">' }
];

replaceInFile(path.join(__dirname, 'views/login.ejs'), loginReplacements);
console.log('login.ejs done');

const indexReplacements = [
    { search: '<html lang="zh-Hant">', replace: '<html lang="<%= lang === \'zh-tw\' ? \'zh-Hant\' : lang === \'zh-cn\' ? \'zh-Hans\' : lang === \'ja-jp\' ? \'ja\' : \'en\' %>">' },
    { search: '<title>Arknights 抽卡紀錄</title>', replace: '<title><%= t(\'index_title\') %></title>' },
    { search: '>導出結果<', replace: '><%= t(\'export_results\') %><' },
    { search: '導出結果</a>', replace: '<%= t(\'export_results\') %></a>' },
    { search: '登出</a>', replace: '<%= t(\'logout\') %></a>' },
    { search: '>登出<', replace: '><%= t(\'logout\') %><' },
    { search: '<%= nickname %> 的尋訪紀錄', replace: '<%= nickname %><%= t(\'user_record_suffix\') %>' },
    { search: '<span>POOL SELECTOR<br>（不影響統計資訊）</span>', replace: '<span><%- t(\'pool_selector\') %></span>' },
    { search: '全選 / 全取消</label>', replace: '<%= t(\'select_all\') %></label>' },
    { search: '統計資訊 ▲</div>', replace: '<%= t(\'stats_info\') %> ▲</div>' },
    { search: '<h3>當前卡池狀態</h3>', replace: '<h3><%= t(\'current_pool_status\') %></h3>' },
    { search: '您最後一次抽取的卡池為：<br/>', replace: '<%= t(\'last_pool_drawn\') %><br/>' },
    { search: '在該卡池中您一共投入了 <span', replace: '<%= t(\'invested_part1\') %><span' },
    { search: '> 抽，距離上次六星已經墊了 <span', replace: '> <%= t(\'invested_part2\') %><span' },
    { search: '> 抽</p>', replace: '> <%= t(\'invested_part3\') %></p>' },
    { search: /次 6 星/g, replace: '<%= t(\'star_times\') %>6<%= t(\'star\') %>' },
    { search: /次 5 星/g, replace: '<%= t(\'star_times\') %>5<%= t(\'star\') %>' },
    { search: /次 4 星/g, replace: '<%= t(\'star_times\') %>4<%= t(\'star\') %>' },
    { search: /次 3 星/g, replace: '<%= t(\'star_times\') %>3<%= t(\'star\') %>' },
    { search: '<h3>總覽資料</h3>', replace: '<h3><%= t(\'overview\') %></h3>' },
    { search: '自 <span', replace: '<%= t(\'since\') %><span' },
    { search: '起，您一共投入了 <span', replace: '<%= t(\'total_invested\') %><span' },
    { search: '共消耗 <span', replace: '<%= t(\'total_spent\') %><span' },
    { search: '合成玉</p>', replace: '<%= t(\'orundum\') %></p>' },
    { search: '您的平均出金抽數為 <span', replace: '<%= t(\'avg_pulls_part1\') %><span' },
    { search: '折合 <span', replace: '<%= t(\'avg_cost\') %><span' },
    { search: '星級分佈</h2>', replace: '<%= t(\'star_distribution\') %></h2>' },
    { search: '無資料</div>', replace: '<%= t(\'no_data\') %></div>' },
    { search: '（總計${total}抽）', replace: '${t(\'total_pulls_count_prefix\')}${total}${t(\'total_pulls_count_suffix\')}' },
    { search: '（已墊 ${subcount} 抽）', replace: '${t(\'pity_acc_prefix\')}${subcount}${t(\'pity_acc_suffix\')}' },
    { search: '<div class="tshJ_L">注意事項</div>', replace: '<div class="tshJ_L"><%= t(\'warning_title\') %></div>' },
    { search: '1：限定尋訪包含：春節、慶典（週年）、夏季、連動，以上卡池之間保底不互通。', replace: '<%= t(\'idx_warning_1\') %>' },
    { search: '2：標準尋訪包含：定向尋訪（單人輪換）、標準尋訪（雙人輪換）、定向選調（單UP）、標準選調（雙UP）、選調復刻、<br />\n                      &emsp;&emsp;聯合行動、前路回響、定向甄選，以上卡池之間保底互通。', replace: '<%- t(\'idx_warning_2\') %>' },
    { search: '3：中堅尋訪包含：中堅尋訪（輪換）、中堅甄選，以上卡池之間保底互通。', replace: '<%= t(\'idx_warning_3\') %>' },
    { search: '4：其他尋訪包含：跨年歡慶、跨年歡慶．中堅、新人特惠、剩餘未列出卡池（理應沒有），以上卡池之間保底不互通。', replace: '<%= t(\'idx_warning_4\') %>' },
    { search: '5：抽數的計算規則：標準尋訪與中堅尋訪將繼承保底進度累計計算，其餘尋訪依卡池分開計算。', replace: '<%= t(\'idx_warning_5\') %>' },
    { search: '6：抓取結果理論上與官網查詢結果一致，可能與遊戲內實際操作存在延遲。', replace: '<%= t(\'idx_warning_6\') %>' },
    { search: '7：如果官方的紀錄中有出現卡池欄位為空白的情況，這裡會顯示卡池ID並標注名稱未顯示。', replace: '<%= t(\'idx_warning_7\') %>' },
    { search: '8：如果抓取紀錄與官網紀錄存在差異，可重新抓取，若無法解決，可聯繫網站作者或逕行修改json檔案。', replace: '<%= t(\'idx_warning_8\') %>' },
    { search: '9：如果官網紀錄與遊戲內實際操作存在差異，請直接聯繫官方客服。', replace: '<%= t(\'idx_warning_9\') %>' },
    { search: '近期出金 ▲</div>', replace: '<%= t(\'recent_6star\') %> ▲</div>' },
    { search: '[ 全部摺疊 / 展開 ]</span>', replace: '<%= t(\'collapse_all\') %></span>' },
    { search: '<div class="_P1qVa">獲得幹員（抽數）</div>', replace: '<div class="_P1qVa"><%= t(\'operator_got\') %></div>' },
    { search: '<div class="Zs7Y7r">尋訪卡池</div>', replace: '<div class="Zs7Y7r"><%= t(\'pool\') %></div>' },
    { search: '<div class="GETong">尋訪時間</div>', replace: '<div class="GETong"><%= t(\'pull_time\') %></div>' },
    { search: '尋訪記錄 ▲</div>', replace: '<%= t(\'history\') %> ▲</div>' },
    { search: '<div class="_P1qVa">獲得幹員</div>', replace: '<div class="_P1qVa"><%= t(\'operator_got_no_pulls\') %></div>' },
    { search: '（名稱未顯示）', replace: '<%= t(\'pool_name_hidden\') %>' },
    { search: 'GitHub 原始碼', replace: '<%= t(\'github_code\') %>' },
    { search: '隱私權政策', replace: '<%= t(\'privacy_policy\') %>' },
    { search: '↑ 回到頁首', replace: '<%= t(\'back_to_top\') %>' },
    { search: '（<%= pTotal %>抽）', replace: '（<%= pTotal %><%= t(\'pulls_count_suffix\') %>' },
    { search: '<!-- 上方遮攔區塊 -->', replace: '<!-- 上方遮攔區塊 -->\n      <div style="position: absolute; top: 1rem; right: 4rem; z-index: 100;">\n        <select onchange="window.location.href=\'?lang=\'+this.value" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid #333; padding: 0.3rem; border-radius: 4px;">\n          <option value="zh-tw" <%= lang === \'zh-tw\' ? \'selected\' : \'\' %>>繁體中文</option>\n          <option value="zh-cn" <%= lang === \'zh-cn\' ? \'selected\' : \'\' %>>简体中文</option>\n          <option value="ja-jp" <%= lang === \'ja-jp\' ? \'selected\' : \'\' %>>日本語</option>\n          <option value="en-us" <%= lang === \'en-us\' ? \'selected\' : \'\' %>>English</option>\n        </select>\n      </div>' }
];

replaceInFile(path.join(__dirname, 'views/index.ejs'), indexReplacements);
console.log('index.ejs done');

const privacyReplacements = [
    { search: '<html lang="zh-TW">', replace: '<html lang="<%= lang === \'zh-tw\' ? \'zh-Hant\' : lang === \'zh-cn\' ? \'zh-Hans\' : lang === \'ja-jp\' ? \'ja\' : \'en\' %>">' },
    { search: '<title>隱私權政策 - 明日方舟抽卡紀錄</title>', replace: '<title><%= t(\'privacy_title\') %></title>' },
    { search: '← 返回首頁</a>', replace: '<%= t(\'back_home\') %></a>' },
    { search: '隱私權政策 (Privacy Policy)</h1>', replace: '<%= t(\'privacy_h1\') %></h1>' },
    { search: '最後更新日期 (Last Updated)：2026 年 5 月</p>', replace: '<%= t(\'privacy_date\') %></p>' },
    { search: '1. 簡介 (Introduction)</h2>', replace: '<%= t(\'privacy_intro_title\') %></h2>' },
    { search: '「明日方舟悠星服尋訪紀錄分析工具」(Arknights Global Gacha Helper) 是一個完全開源的網頁工具與對應的 Chromium 擴充功能，旨在協助玩家匯出與統計其遊戲內的尋訪（抽卡）紀錄。</p>', replace: '<%= t(\'privacy_intro_1\') %></p>' },
    { search: '本隱私權政策說明我們的網站引擎與輔助擴充功能如何處理您的資料。</p>', replace: '<%= t(\'privacy_intro_2\') %></p>' },
    { search: '2. 我們收集哪些資料 (Data We Collect)</h2>', replace: '<%= t(\'privacy_data_title\') %></h2>' },
    { search: '為了提供匯出服務，本工具僅會在您的明確操作下，從您的瀏覽器中自動或手動讀取以下特定的驗證資訊 (Authentication Information)：</p>', replace: '<%= t(\'privacy_data_1\') %></p>' },
    { search: '您的登入 Cookie (用於確認登入狀態的 Cookie)</li>', replace: '<%= t(\'privacy_data_2\') %></li>' },
    { search: '3. 我們如何使用您的資料 (How We Use Your Data)</h2>', replace: '<%= t(\'privacy_use_title\') %></h2>' },
    { search: '<strong>單一用途 (Single Purpose)：</strong> 這些驗證資訊「僅且唯一」用於向悠星網路 (Yostar) 的官方伺服器發送符合規範的 API 請求，以下載您的尋訪紀錄，並於完成後立即銷毀。</li>', replace: '<%- t(\'privacy_use_1_title\') %></li>' },
    { search: '<strong>無第三方分享 (No Third-Party Sharing)：</strong> 我們絕對不會將這些資訊分享給任何第三方服務、廣告商或資料仲介。</li>', replace: '<%- t(\'privacy_use_2_title\') %></li>' },
    { search: '<strong>不作其他用途：</strong> 您的憑證不會被用來執行除了「獲取抽卡紀錄」以外的任何未經授權的操作。</li>', replace: '<%- t(\'privacy_use_3_title\') %></li>' },
    { search: '4. 資料傳輸與儲存 (Data Transfer and Storage)</h2>', replace: '<%= t(\'privacy_transfer_title\') %></h2>' },
    { search: '由於官方的 API 設計有安全性考量（CORS 限制），擴充功能需要將取得的驗證資訊透過 HTTPS 以加密的方式發送到我們的 Firebase 伺服器進行代理請求與處理。</p>', replace: '<%= t(\'privacy_transfer_1\') %></p>' },
    { search: '<strong>安全傳輸：</strong> 您與我們伺服器之間的所有通訊皆被 HTTPS / TLS 強制加密。</li>', replace: '<%- t(\'privacy_transfer_2_title\') %></li>' },
    { search: '<strong>無敏感資訊之持久儲存 (No Persistent Storage of Tokens)：</strong> 我們伺服器在取得您的紀錄後，會將您的尋訪紀錄 (Gacha Records) 暫時或經過轉換後快取至我們的 Firebase 雲端資料庫（僅以您的遊戲 UID 作為匿名索引），以便提供統計圖表功能。但您<strong>於Gryphline 網站的登入狀態、驗證 Cookie 與 Token 絕對不會被持久儲存在我們的資料庫中</strong>，並在當次請求處理完畢後立即被銷毀。</li>', replace: '<%- t(\'privacy_transfer_3_title\') %></li>' },
    { search: '5. 擴充功能權限聲明 (Extension Permissions Justification)</h2>', replace: '<%= t(\'privacy_ext_title\') %></h2>' },
    { search: '我們的 Chromium 擴充功能需要以下權限才能正常且安全地運作：</p>', replace: '<%= t(\'privacy_ext_1\') %></p>' },
    { search: '<strong><code>cookies</code>：</strong> 用於讀取您目前在悠星網路 (Yostar) 登入頁面的認證 Cookie。</li>', replace: '<%- t(\'privacy_ext_2\') %></li>' },
    { search: '<strong><code>scripting</code>：</strong> 用於在官方頁面環境中執行極小的局部腳本，以成功提取存放在 <code>localStorage</code> 內的 <code>X-Role-Token</code>。</li>', replace: '<%- t(\'privacy_ext_3\') %></li>' },
    { search: '<strong><code>activeTab</code>：</strong> 確保擴充功能僅在您正處於官方頁面且主動點擊按鈕時才會被觸發。</li>', replace: '<%- t(\'privacy_ext_4\') %></li>' },
    { search: '<strong><code>storage</code>：</strong> 在您的本機暫存設定或提取到的憑證，以傳遞給我們的分析頁面。</li>', replace: '<%- t(\'privacy_ext_5\') %></li>' },
    { search: '6. 使用者的權利 (Your Rights & Consent Revocation)</h2>', replace: '<%= t(\'privacy_rights_title\') %></h2>' },
    { search: '使用本工具即視為您同意我們短暫處理您的驗證資訊以獲取資料。</p>', replace: '<%= t(\'privacy_rights_1\') %></p>' },
    { search: '如果您希望停止使用服務並撤銷同意，您只需：</p>', replace: '<%= t(\'privacy_rights_2\') %></p>' },
    { search: '點擊網頁上的「登出」按鈕清空本機登入狀態。</li>', replace: '<%= t(\'privacy_rights_3\') %></li>' },
    { search: '移除該 Chromium 擴充功能。</li>', replace: '<%= t(\'privacy_rights_4\') %></li>' },
    { search: '（可選）前往<a href="https://account.yostar.co.jp">Yostar 官方網站</a>登出，以無效化您提交的資料。</li>', replace: '<%- t(\'privacy_rights_5\') %></li>' },
    { search: '7. 聯絡我們 (Contact Us)</h2>', replace: '<%= t(\'privacy_contact_title\') %></h2>' },
    { search: '如果您對本隱私權政策有任何疑問、建議，或任何與資料隱私相關的疑慮，請隨時前往<a href="https://github.com/kaihuang1122/Arknights-txwy-Gacha-Analyze/issues">專案的開源倉庫</a>提出 Issue，我們將盡快回覆您。</p>', replace: '<%- t(\'privacy_contact_1\') %></p>' },
    { search: '<h1>', replace: '<div style="position: absolute; top: 1rem; right: 1rem; z-index: 100;">\n      <select onchange="window.location.href=\'?lang=\'+this.value" style="background: rgba(255,255,255,0.1); color: #fff; border: 1px solid #333; padding: 0.3rem; border-radius: 4px;">\n        <option value="zh-tw" <%= lang === \'zh-tw\' ? \'selected\' : \'\' %>>繁體中文</option>\n        <option value="zh-cn" <%= lang === \'zh-cn\' ? \'selected\' : \'\' %>>简体中文</option>\n        <option value="ja-jp" <%= lang === \'ja-jp\' ? \'selected\' : \'\' %>>日本語</option>\n        <option value="en-us" <%= lang === \'en-us\' ? \'selected\' : \'\' %>>English</option>\n      </select>\n    </div>\n    <h1>' }
];

replaceInFile(path.join(__dirname, 'views/privacy.ejs'), privacyReplacements);
console.log('privacy.ejs done');
