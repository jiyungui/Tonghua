/**
 * grid.js — 网格布局计算（参考 GIGI 思路，适配纯 Web）
 * 计算 APP 图标、小组件的像素位置
 */
const Grid = {
    COLUMNS: 3,
    ICON_SIZE: 62,
    GAP: 10,
    PADDING: 8,

    /**
     * 根据容器宽度计算单元格尺寸与偏移
     * @param {number} containerWidth
     * @returns {{ cellSize, leftOffset, totalWidth }}
     */
    calcLayout(containerWidth) {
        const contentWidth = containerWidth - this.PADDING * 2;
        const maxCellWidth = (contentWidth - (this.COLUMNS - 1) * this.GAP) / this.COLUMNS;
        const cellSize = Math.min(this.ICON_SIZE, maxCellWidth);
        const totalWidth = cellSize * this.COLUMNS + this.GAP * (this.COLUMNS - 1);
        const leftOffset = (contentWidth - totalWidth) / 2;
        return { cellSize, leftOffset, totalWidth };
    },

    /**
     * 将网格坐标转为像素坐标
     * @param {number} col  列索引 (0-based)
     * @param {{ cellSize, leftOffset }} layout
     * @returns {number} left px
     */
    colToPx(col, layout) {
        return this.PADDING + layout.leftOffset + col * (layout.cellSize + this.GAP);
    },

    /**
     * 将行索引转为 top px（相对于 apps-grid 顶部）
     * @param {number} row
     * @param {{ cellSize }} layout
     * @returns {number}
     */
    rowToPx(row, layout) {
        return row * (layout.cellSize + this.GAP);
    }
};
