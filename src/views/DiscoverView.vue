<template>
  <book-list
    :books="discoveredBooks"
    :empty-text="暂无推荐书籍"
    @book-click="handleBookClick"
  />
</template> 