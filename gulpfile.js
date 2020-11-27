// ===========================================================================================
// NPM Module 호출
// ===========================================================================================
const { src, dest, watch, series, parallel } = require('gulp');
      del                                    = require('del'),
      concat                                 = require('gulp-concat'),
      uglify                                 = require('gulp-uglify'),
      rename                                 = require('gulp-rename'),
      filter                                 = require('gulp-filter'),
      strip                                  = require('gulp-strip-comments'),
      fileinclude                            = require('gulp-file-include'),
      scss                                   = require('gulp-sass'),
      csso                                   = require('gulp-csso'),
      sourcemaps                             = require('gulp-sourcemaps'),
      autoprefixer                           = require('gulp-autoprefixer'),
      gcmq                                   = require('gulp-group-css-media-queries'),
      imagemin                               = require('gulp-imagemin'),
      pngquant                               = require('imagemin-pngquant'),
      browserSync                            = require('browser-sync').create();

// ===========================================================================================
// 환경설정
// ===========================================================================================
// Directory 설정
const SRC = 'markup';
const BUILD = 'public';

// Markup 폴더 지정
let markup = {
    html : [ SRC + '/html/**/*.html', SRC + '/index.html' ],
    js   : SRC + '/_assets/js/**/*.js',
    css  : SRC + '/sass/**/*.{sass,scss}',
    imgs : SRC + '/_assets/images/**/*',
    fonts: SRC + '/_assets/fonts/**/*',
    lib  : SRC + '/_assets/lib/**/*'
}

// Public 폴더 지정
let public = {
    html : BUILD + '/',
    js   : BUILD + '/assets/js/',
    css  : BUILD + '/assets/css/',
    imgs : BUILD + '/assets/images/',
    fonts: BUILD + '/assets/fonts/',
    lib  : BUILD + '/assets/lib/'
}

// CSS 파일 압축
let cssmin = [
    BUILD + '/assets/css/common.css', // Common UI
    BUILD + '/assets/css/guide.css', // UI KIT Guide
    BUILD + '/assets/css/pages.css', // Pages UI
]

// Sass 옵션
let scssOptions = {
    // outputStyle (Type : String  , Default : nested)
    // CSS의 컴파일 결과 코드스타일 지정
    // Values : nested, expanded, compact, compressed
    outputStyle : "compact",
    // indentType (>= v3.0.0 , Type : String , Default : space)
    // 컴파일 된 CSS의 "들여쓰기" 의 타입
    // Values : space , tab
    indentType : "space",
    // indentWidth (>= v3.0.0, Type : Integer , Default : 2)
    // 컴파일 된 CSS의 "들여쓰기" 의 갯수
    indentWidth : 1,
    // precision (Type :  Integer , Default : 5)
    // 컴파일 된 CSS의 소수점 자리수
    precision: 6,
    // sourceComments (Type : Boolean , Default : false)
    // 컴파일 된 CSS에 원본소스의 위치와 줄수 주석표시
    sourceComments: false
};

// ===========================================================================================
// 기본 업무
// ===========================================================================================
exports.default = series( fileDel,
  parallel(
    series(htmlComplie, scssCompile, concatJs, imgs, fontMove, libMove),
    brwSync,
    watchFiles
  )
);

// ===========================================================================================
// 빌드업무
// ===========================================================================================
exports.build = series( htmlComplie, scssCompile, cssMin, concatJs, jsMin, imgs, fontMove, libMove );

// ===========================================================================================
// 폴더 제거 업무
// ===========================================================================================
function fileDel() {
  return del([ BUILD, BUILD + '/*', BUILD + '/assets/css', BUILD + '/assets/js' ]);
};

// ===========================================================================================
// 관찰 업무
// ===========================================================================================
function watchFiles() {
  watch(markup.imgs, imgs);
  watch(markup.lib, libMove);
  watch(markup.js, concatJs);
  watch(markup.css, scssCompile);
  watch(markup.html).on('change', htmlComplie);
  watch([SRC + '/_assets/*', SRC + '/_include/*']).on('change', htmlComplie);
}

// ===========================================================================================
// Server 업무
// ===========================================================================================
function brwSync() {
  browserSync.init({
    notify: !true,
    port: 8080,
    server:{
      baseDir: [BUILD]
    }
  });
}

// ===========================================================================================
// Include(Gulp File Include) 업무
// ===========================================================================================
function htmlComplie() {
  return src(markup.html)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(strip({ trim: true, ignore: '/\/\*\*\s*\n([^\*]|(\*(?!\/)))*\*\//g' }))
    .pipe(dest(public.html))
    .pipe(browserSync.reload({ stream:true }));
};

// ===========================================================================================
// Sass 업무
// ===========================================================================================
function scssCompile() {
  return src(markup.css)
    .pipe(sourcemaps.init())
    .pipe(scss(scssOptions).on('error', scss.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./map'))
    .pipe(dest(public.css))
    .pipe(filter("**/*.css"))
    .pipe(gcmq())
    .pipe(browserSync.reload({ stream:true }));
};

// ===========================================================================================
// CSS 압축 업무
// ===========================================================================================
function cssMin() {
  return src(cssmin)
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(dest(public.css))
};

// ===========================================================================================
// JS 병합 업무
// ===========================================================================================
function concatJs() {
  return src(markup.js)
    .pipe(concat('common.js'))
    .pipe(dest(public.js))
    .pipe(browserSync.reload({ stream:true }));
}

// ===========================================================================================
// JS 압축 업무
// ===========================================================================================
function jsMin() {
  return src(public.js)
    .pipe(uglify())
    .pipe(rename('common.min.js'))
    .pipe(dest(public.js + 'min/'))
};

// ===========================================================================================
// Images min 업무
// ===========================================================================================
function imgs() {
  return src(markup.imgs)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        use: [pngquant()]
      })
    )
    .pipe(dest(public.imgs))
    .pipe(browserSync.reload({ stream:true }));
}

// ===========================================================================================
// File & Folder 이동 업무
// ===========================================================================================
// 웹 폰트
function fontMove() {
  return src(markup.fonts)
    .pipe(dest(public.fonts))
};

// 라이브러리
function libMove() {
  return src(markup.lib)
    .pipe(dest(public.lib))
};