package chess.controller.command;

import chess.domain.board.Board;
import chess.dto.BoardDTO;
import chess.view.OutputView;

public abstract class AbstractCommand implements Command {

    protected static final String STATUS_COMMAND = "status";
    protected static final String MOVE_COMMAND = "move";
    protected static final String START_COMMAND = "start";
    protected static final String END_COMMAND = "end";
    protected static final String EXIT_COMMAND = "exit";

    protected final Board board;

    protected AbstractCommand(final Board board) {
        this.board = board;
    }

    @Override
    public boolean isExit() {
        return false;
    }

    protected void printErrorMessage(String message) {
        OutputView.printErrorMessage("올바른 명령어가 아닙니다.");
        OutputView.printErrorMessage("가능한 명령어 : " + message);
    }

    protected boolean commandIsStatus(String command) {
        if (STATUS_COMMAND.equals(command)) {
            OutputView.printStatus(new BoardDTO(board));
            return true;
        }
        return false;
    }
}
