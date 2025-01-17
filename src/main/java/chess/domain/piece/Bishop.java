package chess.domain.piece;

import java.util.List;
import java.util.Map;

public final class Bishop extends AbstractPiece {

    private static final double SCORE = 3;
    private static final String SYMBOL = "b";
    private static final int ABLE_LENGTH = 7;

    public Bishop(final Color color, final Position position) {
        super(color, position);
    }

    @Override
    public String symbol() {
        return changeColorSymbol(SYMBOL);
    }

    @Override
    public double score() {
        return SCORE;
    }

    @Override
    public Piece move(final Position position, final Map<Position, Piece> pieces) {
        validateMove(position, pieces);
        return new Bishop(color, position);
    }

    @Override
    public List<Position> movablePositions(final Map<Position, Piece> pieces) {
        final List<Direction> directions = Direction.diagonalDirection();

        return positions(pieces, directions, ABLE_LENGTH);
    }
}
