// Data source for Doshi Course Portal
// Contains user accounts, online technical modules, management modules, offline courses, video embeds, attachments, and QA logs

const DEFAULT_USERS = [
  { email: 'hocvien@doshi.vn', password: 'doshi2026', name: 'Nguyễn Văn Học Viên', role: 'student', avatar: 'HV' },
  { email: 'giangvien@doshi.vn', password: 'doshi2026', name: 'Chuyên Gia Doshi', role: 'instructor', avatar: 'CG' },
  { email: 'admin@doshi.vn', password: 'admin', name: 'Doshi Admin', role: 'admin', avatar: 'AD' }
];

let COURSE_MODULES = [
  {
    id: 1,
    title: 'Hướng dẫn tự lắp đặt máy giặt giày, tủ sấy giày',
    shortTitle: 'Tự lắp đặt máy giặt & sấy',
    duration: '25 phút',
    videoUrl: 'https://www.youtube.com/embed/Hl2rT_c9g8I',
    bullets: [
      'Hướng dẫn chi tiết từng bước kết nối nguồn nước, nguồn điện và đường ống xả.',
      'Dễ dàng tự thực hiện tại nhà với các công cụ cơ bản sẵn có.',
      'Tiết kiệm chi phí thuê thợ lắp đặt và chủ động bảo trì máy về sau.'
    ],
    description: 'Bài học này giúp bạn hiểu rõ nguyên lý lắp đặt dòng máy giặt giày công nghiệp Doshi và tủ sấy giày thông minh. Bạn sẽ biết cách kết nối đường ống cấp nước chịu áp lực, lắp đặt bộ lọc thô đầu vào để giữ cặn bẩn, nối ống thoát nước thải, và kết nối nguồn điện gia đình 220V an toàn chống rò rỉ điện.',
    attachments: [
      { name: 'Sơ đồ lắp đặt kỹ thuật máy giặt Doshi.pdf', size: '2.4 MB' },
      { name: 'Checklist dụng cụ lắp đặt cần thiết.docx', size: '150 KB' }
    ],
    comments: [
      {
        author: 'Nguyễn Minh Tuấn',
        avatar: 'MT',
        role: 'student',
        date: '2 ngày trước',
        content: 'Ống xả của máy giặt giày Doshi dùng phi bao nhiêu vậy thầy? Em muốn chuẩn bị sẵn đầu chờ thoát sàn.'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '1 ngày trước',
        content: 'Chào Tuấn, ống xả của máy giặt Doshi đi kèm dùng đường kính phi 34 (34mm). Em nên làm đầu chờ phi 42 hoặc 60 thoát sàn để nước thoát nhanh và không bị trào ngược nhé.'
      }
    ]
  },
  {
    id: 2,
    title: 'Hướng dẫn sử dụng máy giặt giày',
    shortTitle: 'Hướng dẫn sử dụng máy giặt',
    duration: '35 phút',
    videoUrl: 'https://www.youtube.com/embed/T1Q0T2VpMnc',
    bullets: [
      'Cách vận hành máy giặt giày tự động an toàn và tối ưu năng suất.',
      'Lựa chọn các chế độ giặt phù hợp cho từng loại giày (giày vải, thể thao, da).',
      'Mẹo sử dụng hiệu quả để nâng cao tuổi thọ máy và tiết kiệm hóa chất.'
    ],
    description: 'Học cách sử dụng bảng điều khiển của máy giặt giày Doshi. Hướng dẫn cách xếp giày vào lồng giặt sao cho chổi xoay có thể tiếp xúc và làm sạch mọi góc cạnh của giày mà không làm xước hay biến dạng form giày. Hướng dẫn thiết lập lượng nước, tốc độ quay và thời gian giặt tối ưu.',
    attachments: [
      { name: 'Sổ tay hướng dẫn sử dụng máy giặt giày Doshi v2.pdf', size: '4.8 MB' },
      { name: 'Bảng cài đặt chế độ giặt nhanh tham khảo.xlsx', size: '85 KB' }
    ],
    comments: [
      {
        author: 'Lê Hoàng Long',
        avatar: 'LL',
        role: 'student',
        date: '3 ngày trước',
        content: 'Một lần giặt của máy Doshi thì giặt được tối đa bao nhiêu đôi giày vải vậy ạ?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '3 ngày trước',
        content: 'Máy giặt giày Doshi tiêu chuẩn có công suất giặt từ 4 - 6 đôi/mẻ đối với giày người lớn tùy kích cỡ. Giày trẻ em có thể giặt từ 8-10 đôi một lần em nhé.'
      }
    ]
  },
  {
    id: 3,
    title: 'Hướng dẫn sử dụng tủ sấy giày',
    shortTitle: 'Hướng dẫn sử dụng tủ sấy',
    duration: '30 phút',
    videoUrl: 'https://www.youtube.com/embed/3u_V-WzK9E4',
    bullets: [
      'Cách vận hành tủ sấy tuần hoàn nhiệt đối lưu thông minh.',
      'Cài đặt thời gian sấy và dải nhiệt độ phù hợp tránh làm hỏng keo giày.',
      'Quy trình bảo quản và vệ sinh định kỳ tủ sấy giày luôn sạch sẽ.'
    ],
    description: 'Tủ sấy giày Doshi sử dụng công nghệ sấy tuần hoàn gió nóng nhiệt độ thấp giúp làm khô giày từ trong ra ngoài. Bài học này sẽ hướng dẫn bạn cài đặt nhiệt độ tối ưu (thường từ 40°C - 50°C tùy chất liệu) để không ảnh hưởng đến lớp keo dán của giày thể thao, cách bố trí giày trên các giá treo để luồng khí nóng lưu thông tốt nhất.',
    attachments: [
      { name: 'Hướng dẫn vận hành tủ sấy tuần hoàn Doshi.pdf', size: '1.9 MB' }
    ],
    comments: [
      {
        author: 'Trần Thị Mai',
        avatar: 'TM',
        role: 'student',
        date: '5 ngày trước',
        content: 'Sấy giày da thật thì nên đặt nhiệt độ bao nhiêu độ C để không bị khô nứt da ạ?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '4 ngày trước',
        content: 'Đối với các dòng giày da thật cao cấp, em tuyệt đối không sấy ở nhiệt độ cao. Nên để chế độ sấy gió mát (không bật nhiệt) hoặc đặt nhiệt độ thấp nhất dưới 35°C để da khô tự nhiên, tránh bị co rút hay nứt gãy nếp da nhé.'
      }
    ]
  },
  {
    id: 4,
    title: 'Hướng dẫn vệ sinh giày cơ bản (Bao gồm sử dụng các loại nước giặt giày)',
    shortTitle: 'Vệ sinh giày cơ bản',
    duration: '45 phút',
    videoUrl: 'https://www.youtube.com/embed/o2_N5wQyP-U',
    bullets: [
      'Quy trình vệ sinh giày thể thao vải, mesh, canvas cơ bản.',
      'Giới thiệu công dụng các loại nước giặt, dung dịch tạo bọt chuyên dụng.',
      'Cách sử dụng nước tẩy, bàn chải lông mềm/cứng hiệu quả và an toàn.'
    ],
    description: 'Hướng dẫn quy trình 5 bước vệ sinh giày cơ bản: Gỡ dây và lót giày, xả đất thô, đánh sạch đế và cạnh giày bằng bàn chải cứng, giặt sạch thân giày bằng dung dịch bọt và bàn chải mềm, cuối cùng là xả nước và vắt ráo. Giới thiệu các hóa chất tẩy rửa an toàn cho vải dệt và mesh.',
    attachments: [
      { name: 'Quy trình vệ sinh giày cơ bản 5 bước.pdf', size: '850 KB' },
      { name: 'Danh sách hóa chất vệ sinh giày khuyên dùng.pdf', size: '600 KB' }
    ],
    comments: [
      {
        author: 'Nguyễn Văn Định',
        avatar: 'VĐ',
        role: 'student',
        date: '1 tuần trước',
        content: 'Có nên dùng nước rửa chén hoặc xà phòng Omo giặt giày Mesh trắng không thầy?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '1 tuần trước',
        content: 'Không nên em nhé. Omo hoặc nước rửa chén có tính kiềm rất cao, dễ làm ố vàng giày trắng sau khi phơi/sấy và làm cứng sợi mesh. Nên dùng dung dịch trung tính chuyên dụng như Crep Protect, Jason Markk hoặc nước giặt Doshi Neutral nhé.'
      }
    ]
  },
  {
    id: 5,
    title: 'Hướng dẫn vệ sinh giày chuyên sâu',
    shortTitle: 'Vệ sinh giày chuyên sâu',
    duration: '50 phút',
    videoUrl: 'https://www.youtube.com/embed/9m_Jd14n_bA',
    bullets: [
      'Phương pháp xử lý các vết bẩn cứng đầu (như dầu mỡ, mực, kẹo cao su, nấm mốc).',
      'Kỹ thuật vệ sinh giày da lộn, da nubuck, giày luxury nhạy cảm bằng tay.',
      'Mẹo làm sạch sâu kẽ chỉ, phục hồi form giày ban đầu bằng shoe tree.'
    ],
    description: 'Bài học nâng cao dành cho thợ kỹ thuật chính. Hướng dẫn cách xử lý các vết ố dầu mỡ cứng đầu bằng cồn isopropyl hoặc dung dịch tách dầu, làm sạch các vết mốc sâu trong sợi vải. Đặc biệt là quy trình spa giày hiệu Hermes, Gucci, Yeezy với chất liệu da lộn nhạy cảm bằng bàn chải lông heo và gôm tẩy chuyên dụng.',
    attachments: [
      { name: 'Cẩm nang spa giày hiệu Luxury & Da lộn.pdf', size: '3.1 MB' }
    ],
    comments: [
      {
        author: 'Hoàng Quốc Việt',
        avatar: 'QV',
        role: 'student',
        date: '1 tuần trước',
        content: 'Giày da lộn sau khi giặt xong bị cứng ráp bề mặt thì xử lý thế nào ạ?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '1 tuần trước',
        content: 'Da lộn sau khi khô thường bị bết lông làm cứng da. Em dùng bàn chải chuyên dụng cho da lộn (hoặc bàn chải đồng/bàn chải cao su) chải nhẹ nhàng theo một hướng để dựng lại sợi lông, da sẽ mềm mại như cũ nhé.'
      }
    ]
  },
  {
    id: 6,
    title: 'Hướng dẫn quy trình từ giặt - vắt giày - sấy giày',
    shortTitle: 'Quy trình Giặt - Vắt - Sấy',
    duration: '30 phút',
    videoUrl: 'https://www.youtube.com/embed/R9xH_Z2lM8I',
    bullets: [
      'Quy trình phối hợp 3 bước tiêu chuẩn khép kín trong tiệm giặt giày.',
      'Tối ưu hóa thời gian xử lý đơn hàng để trả giày cho khách trong ngày.',
      'Kỹ thuật vắt ráo nước bằng lồng vắt ly tâm giúp giày không bị méo form.'
    ],
    description: 'Quy trình vận hành tối ưu năng suất tại cửa hàng. Bạn sẽ học cách phân bổ công việc: nhận giày -> giặt lồng chổi -> vắt ly tâm dùng túi chống sốc chuyên dụng -> sấy khô tuần hoàn -> kiểm tra chất lượng (QC) -> đóng gói. Cách sử dụng lồng vắt ly tâm tốc độ cao giúp loại bỏ 80% lượng nước trong giày chỉ trong 1 phút.',
    attachments: [
      { name: 'Sơ đồ luồng công việc xưởng spa giày Doshi.pdf', size: '1.5 MB' },
      { name: 'Biểu mẫu đánh giá chất lượng đầu ra QC.pdf', size: '340 KB' }
    ],
    comments: [
      {
        author: 'Vũ Hữu Phước',
        avatar: 'HP',
        role: 'student',
        date: '2 tuần trước',
        content: 'Lồng vắt ly tâm có làm bong keo gót giày không thầy? Em hơi lo lúc nó quay nhanh.'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '2 tuần trước',
        content: 'Nếu em đặt giày lỏng lẻo thì lực quán tính có thể làm giày đập vào lồng gây hỏng. Bí quyết là phải dùng túi vắt giày Doshi (có đệm mút chống va đập) và chèn chặt lồng giặt bằng khăn mềm phụ trợ, lúc đó giày quay đồng tâm cực kỳ an toàn.'
      }
    ]
  },
  {
    id: 7,
    title: 'Hướng dẫn sử dụng tủ tẩy ố UV',
    shortTitle: 'Sử dụng tủ tẩy ố UV',
    duration: '40 phút',
    videoUrl: 'https://www.youtube.com/embed/g_YcKz-c640',
    bullets: [
      'Cơ chế hóa học tẩy ố vàng trên đế cao su bằng ánh sáng UV và kem Sole Bright.',
      'Hướng dẫn vận hành tủ tẩy ố UV Doshi an toàn, tiết kiệm điện.',
      'Những lưu ý quan trọng để tránh làm giòn đế hoặc biến màu nhựa trong quá trình tẩy.'
    ],
    description: 'Tẩy ố vàng đế cao su (oxidized soles) là dịch vụ có biên lợi nhuận cao nhất trong spa giày. Bài học này hướng dẫn bạn bôi kem tẩy ố (chứa H2O2 nồng độ cao), bọc màng co PE giữ ẩm, và đặt vào tủ chiếu tia UV Doshi với thời gian từ 2 - 4 tiếng. Học cách kiểm soát nhiệt độ trong tủ UV tránh làm chảy keo giày.',
    attachments: [
      { name: 'Quy trình tẩy ố vàng đế giày chuyên nghiệp.pdf', size: '2.2 MB' },
      { name: 'Lưu ý an toàn sức khỏe khi tiếp xúc tia cực tím UV.pdf', size: '420 KB' }
    ],
    comments: [
      {
        author: 'Trần Văn Sang',
        avatar: 'TS',
        role: 'student',
        date: '2 tuần trước',
        content: 'Tủ UV Doshi này tẩy được bao nhiêu đôi cùng lúc thế ạ?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '2 tuần trước',
        content: 'Tủ tẩy ố UV Doshi của chúng ta có 3 tầng khay inox thông minh, mỗi tầng đặt được từ 4 - 6 đôi tùy kích cỡ, tổng công suất tối đa lên đến 18 đôi một lúc em nhé. Đèn UV được bố trí đa hướng giúp chiếu đều toàn bộ đế.'
      }
    ]
  }
];

let MANAGEMENT_MODULES = [
  {
    id: 'mgt-1',
    title: 'Quy trình giao nhận giày chuyên nghiệp',
    shortTitle: 'Quy trình giao nhận giày',
    duration: '25 phút',
    videoUrl: null,
    richTextContent: `
      <div class="rich-text-process">
        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">1. Quy trình nhận giày từ khách hàng</h4>
        <p style="margin-bottom: 16px;">
          Khi tiếp nhận giày (trực tiếp tại quầy hoặc nhận từ shipper), lễ tân thực hiện kiểm tra chi tiết dưới ánh sáng mạnh để phát hiện các lỗi vật lý có sẵn như rách da, bong keo, mòn đế, sứt chỉ. Ghi nhận đầy đủ thông tin vào biên nhận và gắn tag định danh chống thất lạc.
        </p>
        
        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">2. Chụp ảnh lưu trữ trước và sau khi xử lý</h4>
        <p style="margin-bottom: 12px;">
          Học viên bắt buộc thực hiện quy chuẩn chụp ảnh lưu trữ:
        </p>
        <ul style="list-style-type: square; padding-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
          <li><strong>Chụp ảnh trước (Before)</strong>: Chụp rõ nét toàn cảnh các góc của giày (trước, sau, đế) và cận cảnh các vết bẩn, vết ố, hoặc vết rách trước khi tiến hành vệ sinh.</li>
          <li><strong>Chụp ảnh sau (After)</strong>: Sau khi hoàn thành quá trình vệ sinh, sấy khô và QC kiểm tra đạt chuẩn, tiến hành chụp lại ảnh tại đúng các góc tương tự.</li>
          <li><strong>Lưu trữ thông tin</strong>: Đăng toàn bộ ảnh trước/sau vào <strong>Nhóm Zalo nội bộ</strong> và cập nhật trực tiếp lên <strong>Phần mềm quản lý cửa hàng (Shoes Spa App)</strong> kèm mã đơn hàng.</li>
        </ul>
        
        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">3. Bàn giao luồng công việc cho các bộ phận</h4>
        <p style="margin-bottom: 16px;">
          Sau khi ghi nhận thông tin và hình ảnh, lễ tân/người nhận giày chuyển tiếp ngay thông tin chi tiết:
        </p>
        <ul style="list-style-type: square; padding-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
          <li>Gửi thông báo và hiện trạng lỗi cụ thể cho <strong>Bộ phận Kỹ thuật</strong> để lên phương án làm sạch/tẩy ố/repaint phù hợp.</li>
          <li>Gửi thông tin đơn hàng và thời gian hẹn trả cho <strong>Nhân viên Giao nhận (Shipper)</strong> để sắp xếp lộ trình lấy/trả giày tối ưu cho khách hàng.</li>
        </ul>
      </div>
    `,
    bullets: [
      'Quy trình nhận giày: lễ tân tiếp nhận, kiểm tra lỗi và ghi biên nhận.',
      'Chụp ảnh hiện trạng trước và sau khi làm, đăng vào nhóm Zalo và phần mềm quản lý.',
      'Bàn giao thông tin chi tiết cho bộ phận Kỹ thuật và nhân viên Giao hàng.'
    ],
    description: 'Quy trình giao nhận giày là điểm chạm đầu tiên quyết định sự tin tưởng của khách hàng. Bài học này hướng dẫn các bước nhận giày chuẩn mực, chụp ảnh trước/sau lưu trữ vào Zalo và phần mềm hệ thống để làm minh chứng nghiệm thu, sau đó phân phối thông tin cho thợ kỹ thuật và shipper để hoàn thành chu trình dịch vụ.',
    attachments: [
      { name: 'Mẫu biên nhận giao nhận giày tiêu chuẩn.docx', size: '180 KB' },
      { name: 'Checklist quy trình kiểm tra hiện trạng giày.pdf', size: '450 KB' }
    ],
    comments: [
      {
        author: 'Phạm Hồng Thái',
        avatar: 'HT',
        role: 'student',
        date: '1 ngày trước',
        content: 'Nếu khách gửi ship từ xa đến thì mình kiểm tra và xác nhận lỗi có sẵn thế nào ạ?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '18 giờ trước',
        content: 'Chào Thái, với giày ship từ xa, khi khui thùng em cần quay video unbox liên tục. Sau đó chụp ảnh cận cảnh các lỗi có sẵn gửi ngay qua Zalo cho khách xác nhận trước khi làm nhé.'
      }
    ]
  },
  {
    id: 'mgt-2',
    title: 'Tư vấn dịch vụ & Phân loại chất liệu giày',
    shortTitle: 'Tư vấn dịch vụ & phân loại',
    duration: '35 phút',
    videoUrl: null,
    richTextContent: `
      <div class="rich-text-process">
        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">1. Quy tắc nhận diện & phân loại 5 chất liệu giày chính</h4>
        <p style="margin-bottom: 12px;">
          Để tư vấn gói dịch vụ chính xác và tránh làm hư hỏng giày của khách hàng trong quá trình giặt, học viên cần nắm vững cách nhận diện các chất liệu sau:
        </p>
        <ul style="list-style-type: square; padding-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
          <li><strong>Da trơn (Smooth Leather)</strong>: Bề mặt phẳng, bóng hoặc mờ. Dễ lau chùi, nhưng dễ trầy xước. Tư vấn gói giặt chuyên sâu kết hợp dưỡng chất dưỡng da chuyên dụng.</li>
          <li><strong>Da lộn (Suede) / Nubuck</strong>: Bề mặt có lớp lông tơ mịn. Rất nhạy cảm với nước, dễ bạc màu và loang màu nếu tiếp xúc nhiều nước hoặc chất tẩy mạnh. Yêu cầu dùng gói vệ sinh khô (Dry Clean).</li>
          <li><strong>Vải lưới (Mesh) / Vải dệt (Knit/Canvas)</strong>: Sợi vải bám bụi sâu. Rất dễ giặt nhưng cọ mạnh dễ bị sờn xơ. Cần giặt chổi mềm và sấy khô nhanh để tránh ố vàng.</li>
          <li><strong>Đế cao su / Nhựa TPU</strong>: Cực kỳ bền nhưng cao su trắng rất dễ bị oxi hóa vàng (ố vàng) sau 6 - 12 tháng sử dụng. Tư vấn tẩy ố Sole Bright kết hợp buồng chiếu UV.</li>
          <li><strong>Da nhân tạo (Faux/PU/Synthetic Leather)</strong>: Rất phổ biến ở các đôi giày thời trang giá rẻ. Dễ bị nổ da, bong tróc tự nhiên do lão hóa theo thời gian. Lễ tân cần kiểm tra kỹ lỗi nứt li ti trước khi nhận để cảnh báo cho khách.</li>
        </ul>
        
        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">2. Phân loại & Tư vấn thay đế giày thể thao theo môn chơi (Pickleball, Tennis, Chạy bộ, Cầu lông...)</h4>
        <p style="margin-bottom: 12px;">
          Khi nhận giày thể thao bị mòn, láng bóng gai hoặc bong đế nặng, lễ tân cần phân tích đúng đặc thù môn thể thao để tư vấn thay đế (Sole Swap) phù hợp:
        </p>
        <ul style="list-style-type: square; padding-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
          <li><strong>Giày Pickleball / Tennis (Sân cứng - Hardcourt)</strong>: Yêu cầu đế cao su siêu bền (DRC) có vân xương cá (herringbone) hoặc vân đa hướng sâu để phanh gấp, chống trượt trên nền bê tông nhám, bảo vệ khớp cổ chân khỏi bị chấn thương.</li>
          <li><strong>Giày Cầu lông / Bóng chuyền (Sân trong nhà - Indoor Court)</strong>: Bắt buộc dùng đế cao su sống (Gum rubber - thường có màu vàng nâu) với thiết kế vân tổ ong/vảy cá để tạo độ bám hít tối đa trên thảm hoặc sàn gỗ, chống trơn do mồ hôi và không để lại vệt xước (Non-marking).</li>
          <li><strong>Giày Chạy bộ (Running - Đường nhựa/Đất)</strong>: Cần đế ngoài (Outsole) có rãnh chống trượt nhẹ, vật liệu cao su phân bổ ở vùng gót và mũi để chịu ma sát đường nhựa. Đảm bảo đế giữa (Midsole) đệm bọt vẫn giữ được độ đàn hồi trước khi dán.</li>
          <li><strong>Kịch bản tư vấn thay đế</strong>: <i>"Đế giày chơi Pickleball/Tennis của anh/chị đã mòn nhẵn mất hết ma sát, rất dễ gây trượt chân lật cổ chân khi cứu bóng. Bên em có sẵn đế cao su chuyên dụng chính hãng, thay dán ép nhiệt PU và khâu gia cố toàn diện để khôi phục 95% hiệu năng bám sân của giày ạ."</i></li>
        </ul>

        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">3. Kịch bản tư vấn các dịch vụ gia tăng khác & Nghệ thuật Upsell</h4>
        <p style="margin-bottom: 12px;">
          Nâng cao doanh số bằng cách đề xuất các dịch vụ gia tăng giá trị thiết thực:
        </p>
        <ul style="list-style-type: square; padding-left: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px;">
          <li><strong>Upsell dịch vụ Tẩy ố vàng đế</strong>: Khi khách gửi giặt giày có đế cao su ố vàng, hãy chỉ cho khách xem vết ố và tư vấn: <i>"Giặt cơ bản chỉ làm sạch vết bẩn bề mặt, anh/chị nên làm gói Tẩy ố UV chuyên sâu để phục hồi độ trắng sáng cho đế giày đạt 85-90% ạ."</i></li>
          <li><strong>Upsell nhuộm hồi màu / Repaint</strong>: Đề xuất cho giày da trơn bị bong tróc sơn gót/mũi giày hoặc da lộn bạc màu: <i>"Giày của anh/chị đã giặt sạch nhưng bề mặt bị trầy da nặng. Em khuyên dùng thêm gói Repaint màu/nhuộm phục hồi để đôi giày khôi phục diện mạo như mới ạ."</i></li>
          <li><strong>Upsell dán đế cao su bảo vệ (Sole Protector)</strong>: Khuyên dùng cho giày đắt tiền, Jordan, giày hiệu: <i>"Anh/chị dán thêm một lớp cao su bảo vệ Vibram/Doshi giúp chống trượt, ngăn mòn đế zin và tăng độ bền giày thêm 3 - 5 năm ạ."</i></li>
        </ul>
        
        <h4 style="color: var(--color-gold); margin-bottom: 12px; font-size: 1.05rem;">4. Quy trình ký cam kết rủi ro lão hóa vật liệu</h4>
        <p style="margin-bottom: 16px;">
          Đối với giày đã quá cũ (đế cao su hóa nhựa cứng dễ vỡ, keo khô tự nhiên, da PU bong tróc), lễ tân buộc phải cho khách ký vào <strong>Biên bản cam kết rủi ro lão hóa</strong> để bảo vệ uy tín cửa hàng trước khi bàn giao cho thợ xử lý.
        </p>
      </div>
    `,
    bullets: [
      'Cách nhận diện nhanh 5 chất liệu da trơn, da lộn, mesh, vải dệt, da nhân tạo.',
      'Phân loại và kịch bản tư vấn thay đế giày thể thao theo môn chơi (Pickleball, Tennis, Cầu lông, Chạy bộ).',
      'Kịch bản khơi gợi nhu cầu tư vấn nâng cao và quy chuẩn ký cam kết rủi ro lão hóa.'
    ],
    description: 'Bài học nâng cao kỹ năng tư vấn tại quầy nhằm phân loại chất liệu chuẩn xác, đưa ra gói giặt phù hợp (vệ sinh khô hay nước), đồng thời hướng dẫn phương pháp thuyết phục khách hàng sử dụng dịch vụ chuyên sâu và ký kết rủi ro lão hóa da/keo để bảo vệ quyền lợi cửa hàng.',
    attachments: [
      { name: 'Bảng báo giá dịch vụ spa giày Doshi Academy.pdf', size: '1.1 MB' },
      { name: 'Bản cam kết rủi ro chất liệu lão hóa.pdf', size: '240 KB' }
    ],
    comments: [
      {
        author: 'Lâm Khánh Chi',
        avatar: 'KC',
        role: 'student',
        date: '3 ngày trước',
        content: 'Làm thế nào để upsell gói dán đế Vibram hiệu quả khi khách chỉ muốn giặt giày cơ bản ạ?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '2 ngày trước',
        content: 'Chi hãy chỉ cho khách xem phần đế giày của họ đã bị mòn gót sẵn, giải thích dán đế cao su bảo vệ Vibram sẽ giúp chống trơn trượt, bảo vệ đế zin không bị mòn tiếp và tăng tuổi thọ giày thêm 3 - 5 năm nhé. Cách tư vấn này tỷ lệ chốt cực cao.'
      }
    ]
  },
  {
    id: 'mgt-3',
    title: 'Hướng dẫn sử dụng phần mềm quản lý cửa hàng (Shoes Spa App)',
    shortTitle: 'Sử dụng phần mềm quản lý',
    duration: '30 phút',
    videoUrl: 'https://www.youtube.com/embed/M6_bJ745WpI',
    bullets: [
      'Cách khởi tạo đơn hàng nhanh, chọn dịch vụ tương ứng và in biên nhận.',
      'Quản lý dữ liệu khách hàng, ghi nhận thanh toán tiền mặt/chuyển khoản.',
      'Xem biểu đồ báo cáo doanh thu tiệm và theo dõi hiệu suất làm việc nhân viên.'
    ],
    description: 'Làm chủ phần mềm quản lý Shoes Spa App chuyên dụng. Bạn sẽ được học cách tạo đơn hàng nhanh, chọn nhiều dịch vụ cùng lúc, áp dụng mã giảm giá, lưu thông tin khách hàng, ghi nhận tạm ứng, in hóa nhiệt cầm tay. Hướng dẫn chủ tiệm cách xem báo cáo doanh thu tuần/tháng/năm trực quan và phân quyền vận hành tài khoản.',
    attachments: [
      { name: 'Tài liệu hướng dẫn sử dụng phần mềm quản lý.pdf', size: '3.6 MB' },
      { name: 'Mẫu phân quyền tài khoản quản trị và nhân viên.xlsx', size: '120 KB' }
    ],
    comments: [
      {
        author: 'Nguyễn Hoàng Long',
        avatar: 'HL',
        role: 'student',
        date: '2 ngày trước',
        content: 'Phần mềm này có dùng được trên ipad và điện thoại không thầy?'
      },
      {
        author: 'Chuyên Gia Doshi',
        avatar: 'CG',
        role: 'instructor',
        date: '1 ngày trước',
        content: 'Chào Long, phần mềm là dạng Web App responsive nên chạy mượt mà trên mọi trình duyệt của máy tính bàn, laptop, ipad và điện thoại thông minh nhé.'
      }
    ]
  }
];

const OFFLINE_COURSES = [
  {
    id: 'off-1',
    title: 'Nghiệp vụ Vệ sinh Giày chuyên sâu',
    duration: '7 ngày thực hành trực tiếp',
    hours: '40 giờ lên lớp',
    icon: '👟',
    price: '3.500.000đ',
    badge: 'Phổ Biến',
    description: 'Học thực hành trực tiếp (cầm tay chỉ việc) quy trình phân loại chất liệu và giặt giày bằng cả tay và máy công nghệ cao Doshi.',
    skills: [
      'Nhận biết chính xác 5 loại chất liệu (da trơn, da lộn, nubuck, canvas, mesh)',
      'Thực hành xử lý bùn đất, vết loang màu, vết mốc bám sâu',
      'Vận hành máy giặt giày tự động chổi quay an toàn',
      'Làm chủ quy trình vắt và làm khô tuần hoàn giữ form giày'
    ]
  },
  {
    id: 'off-2',
    title: 'Kỹ thuật Tẩy ố Vàng & Khử mùi Ozone',
    duration: '5 ngày thực hành trực tiếp',
    hours: '30 giờ lên lớp',
    icon: '☀️',
    price: '2.800.000đ',
    badge: 'Chuyên môn cao',
    description: 'Khóa chuyên đề hóa chất Sole Bright kết hợp buồng chiếu UV và khử mùi bằng công nghệ Ozone giúp phục hồi màu cao su bị oxi hóa.',
    skills: [
      'Pha trộn dung dịch tẩy ố theo tỷ lệ tối ưu',
      'Kỹ thuật phủ kem Sole Bright và quấn màng co giữ ẩm',
      'Kiểm soát thời gian chiếu và nhiệt độ trong tủ UV Doshi',
      'Vận hành buồng Ozone khử mùi nấm mốc triệt để'
    ]
  },
  {
    id: 'off-3',
    title: 'Thay đế & Khâu đế Giày thể thao',
    duration: '10 ngày thực hành trực tiếp',
    hours: '60 giờ lên lớp',
    icon: '🛠️',
    price: '6.000.000đ',
    badge: 'VIP - Hút khách',
    description: 'Đặc trị các ca giày thể thao hỏng đế, bong keo nặng. Kỹ thuật tách đế cũ, vệ sinh bề mặt, trét keo chuyên dụng và may chỉ chịu lực.',
    skills: [
      'Sử dụng máy khò nhiệt tách đế không làm biến dạng mũi giày',
      'Xử lý lớp keo cũ bằng dung dịch chuyên dụng dung môi mạnh',
      'Quy trình quét keo nhiệt (PU) và ép lực nén định hình đế',
      'May chỉ gia cố đế giày thể thao bền bỉ (McKay stitch)'
    ]
  },
  {
    id: 'off-4',
    title: 'Nghệ thuật Phục hồi màu & Repaint nhuộm giày',
    duration: '12 ngày thực hành trực tiếp',
    hours: '72 giờ lên lớp',
    icon: '🎨',
    price: '6.500.000đ',
    badge: 'Kỹ năng nâng cao',
    description: 'Khai phá kỹ năng sơn repaint, dặm màu cho da trơn, nhuộm phục hồi màu da lộn, da nubuck bạc màu bằng súng phun sơn chuyên nghiệp.',
    skills: [
      'Chà nhám, xả sơn bóng và tẩy lớp bảo vệ da cũ (Preparer/Deglazer)',
      'Kỹ thuật pha màu chuẩn 99% theo màu gốc của hãng',
      'Làm chủ súng phun sơn Airbrush cho lớp sơn mịn màng',
      'Nhuộm thấm da lộn, da nubuck không khô cứng'
    ]
  }
];

if (typeof window !== 'undefined') {
  window.DEFAULT_USERS = DEFAULT_USERS;
  window.COURSE_MODULES = COURSE_MODULES;
  window.MANAGEMENT_MODULES = MANAGEMENT_MODULES;
  window.OFFLINE_COURSES = OFFLINE_COURSES;
}
