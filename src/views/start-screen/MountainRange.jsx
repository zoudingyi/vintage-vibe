function MountainRange() {
  return (
    <svg className="mountain-range" viewBox="0 0 1440 260" preserveAspectRatio="none" focusable="false">
      <defs>
        <linearGradient id="mountain-distance" x2="0" y2="1">
          <stop stopColor="#794287" />
          <stop offset="1" stopColor="#302044" />
        </linearGradient>
        <linearGradient id="mountain-shadow" x2="0" y2="1">
          <stop stopColor="#29113f" />
          <stop offset="1" stopColor="#100d2c" />
        </linearGradient>
        <linearGradient id="mountain-light" x2="0.6" y2="1">
          <stop stopColor="#99559f" />
          <stop offset="0.5" stopColor="#57316f" />
          <stop offset="1" stopColor="#211533" />
        </linearGradient>
        <clipPath id="mountain-silhouette">
          <path d="M0 180 60 152 110 111 142 133 188 80 220 62 247 28 275 65 313 87 353 133 393 147 440 112 464 123 510 168 563 190 612 148 645 130 674 163 720 190 768 179 819 116 850 96 884 59 914 90 940 102 982 153 1017 139 1056 80 1086 67 1110 103 1144 121 1178 172 1215 147 1260 123 1291 151 1324 170 1352 147 1382 181 1440 195V260H0Z" />
        </clipPath>
      </defs>
      <path fill="url(#mountain-distance)" opacity="0.7" d="M0 176 58 125 98 145 162 67 193 94 237 117 301 66 338 100 375 82 430 145 485 106 552 152 606 123 660 172 716 147 763 164 809 111 862 136 928 78 957 105 1009 61 1057 111 1128 89 1182 130 1231 92 1277 137 1333 111 1387 158 1440 137V260H0Z" />
      <g clipPath="url(#mountain-silhouette)">
        <path fill="url(#mountain-shadow)" d="M0 0H1440V260H0Z" />
        <g fill="url(#mountain-light)">
          <path d="M0 180 110 111 95 166 63 197 152 250H0Z" />
          <path d="M142 133 188 80 220 62 247 28 239 95 204 130 217 164 162 205 125 260H54Z" />
          <path d="M393 147 440 112 433 154 408 187 455 234 364 260H292Z" />
          <path d="M563 190 612 148 645 130 630 172 643 199 585 239 526 260H484Z" />
          <path d="M768 179 819 116 850 96 884 59 871 120 837 154 844 188 783 225 746 260H672Z" />
          <path d="M1017 139 1056 80 1086 67 1068 129 1082 155 1032 199 1007 234 935 260H879Z" />
          <path d="M1215 147 1260 123 1242 173 1269 205 1206 246 1159 260H1106Z" />
          <path d="M1324 170 1352 147 1348 190 1381 221 1304 260H1243Z" />
        </g>
        <g fill="#63396f" opacity="0.32">
          <path d="M247 28 275 65 313 87 293 135 260 168 239 95Z" />
          <path d="M884 59 914 90 940 102 921 139 899 168 871 120Z" />
          <path d="M1086 67 1110 103 1144 121 1119 165 1097 185 1068 129Z" />
        </g>
        <g fill="none" stroke="#c485bb" strokeWidth="1.2" opacity="0.35">
          <path d="m247 28-8 67-35 35 13 34-55 41M884 59l-13 61-34 34 7 34-61 37M1086 67l-18 62 14 26-50 44" />
        </g>
      </g>
    </svg>
  );
}

export default MountainRange;
