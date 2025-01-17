package chess.domain.piece;

import java.util.List;
import java.util.Map;

public final class Knight extends AbstractPiece {

    private static final double SCORE = 2.5;
    private static final String SYMBOL = "n";
    private static final int ABLE_LENGTH = 1;

    public Knight(final Color color, final Position position) {
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
        return new Knight(color, position);
    }

    @Override
    public List<Position> movablePositions(final Map<Position, Piece> pieces) {
        final List<Direction> directions = Direction.knightDirection();

        return positions(pieces, directions, ABLE_LENGTH);
    }
}
